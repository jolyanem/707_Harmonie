import jwt from 'jsonwebtoken';
import express from 'express';
import { db } from '../db';

const authRouter = express.Router();

authRouter
  .post('/login', async (req, res) => {
    try {
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

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          statut: user.statut,
        },
        process.env.JWT_SECRET ?? 'secret',
        { expiresIn: '1d' }
      );

      // TODO Envoyer l'email
      console.log('Magic link sent to :', user.email, 'with token :', token);

      res.status(200).json({
        status: 200,
        success: true,
        message: 'Magic link sent.',
      });
    } catch (error) {
      console.error('Error during the token generation :', error);
      // Gérer l'erreur
    }
  })
  .get('/verify', (req, res) => {
    const token = req.query.token;
    console.log('Token :', token);

    if (typeof token !== 'string') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Bad request',
      });
    }

    try {
      const verification = jwt.verify(
        token,
        process.env.JWT_SECRET ?? 'secret'
      );
      if (typeof verification === 'string') {
        return res.status(401).json({
          status: 401,
          success: false,
          message: 'Unauthorized',
        });
      }
      return res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:5173/');
    } catch {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthorized',
      });
    }
  });

export { authRouter };
