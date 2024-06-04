import jwt from 'jsonwebtoken';
import express from 'express';
import { db } from '../db.js';
import { generateIdFromEntropySize } from 'lucia';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { lucia } from '../lucia.js';

async function createEmailVerificationToken(
  userId: string,
  email: string
): Promise<string> {
  await db.emailVerificationToken.deleteMany({
    where: {
      userId,
    },
  });
  const tokenId = generateIdFromEntropySize(25);
  await db.emailVerificationToken.create({
    data: {
      id: tokenId,
      userId,
      email,
      expiresAt: createDate(new TimeSpan(2, 'h')),
    },
  });
  return tokenId;
}

const sendVerificationEmail = async (
  email: string,
  verificationLink: string
) => {
  console.log(
    'Sending verification email to:',
    email,
    'with link:',
    verificationLink
  );
};

const authRouter = express.Router();

authRouter
  .get('/user', async (req, res) => {
    if (!res.locals.user) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }
    return res.json({
      id: res.locals.user.id,
      email: res.locals.user.email,
      role: res.locals.user.role,
      name: res.locals.user.name,
      surname: res.locals.user.surname,
    });
  })
  .post('/logout', async (req, res) => {
    if (!res.locals.user) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }
    await lucia.invalidateUserSessions(res.locals.user.id);
    return res.status(200);
  })
  .post('/login', async (req, res) => {
    console.log('[POST] Login');
    const { email } = req.body;
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "This user doesn't exist.",
      });
    }
    const verificationToken = await createEmailVerificationToken(
      user.id,
      email
    );
    const verificationLink =
      `${process.env.BACKEND_URL ?? 'http://localhost:3000'}/auth/verify/` +
      verificationToken;
    await sendVerificationEmail(email, verificationLink);
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Magic link sent.',
    });
  })
  .get('/verify/:token', async (req, res) => {
    const verificationToken = req.params.token;
    console.log('Token :', verificationToken);
    if (typeof verificationToken !== 'string') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Bad request',
      });
    }
    const token = await db.emailVerificationToken.findFirst({
      where: {
        id: verificationToken,
      },
    });
    if (!token || !isWithinExpirationDate(token.expiresAt)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Bad request',
      });
    }
    const user = await db.user.findFirst({
      where: {
        id: token.userId,
      },
    });
    if (!user || user.email !== token.email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Bad request',
      });
    }

    await lucia.invalidateUserSessions(user.id);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return res
      .status(302)
      .cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      .redirect(
        (process.env.FRONTEND_URL ?? 'http://localhost:5173') + '/auth/callback'
      );
  });

export { authRouter };
