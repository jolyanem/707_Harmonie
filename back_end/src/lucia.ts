import { Lucia, verifyRequestOrigin } from 'lucia';
import { adapter } from './db.js';
import type { Role } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'PRODUCTION', // set `Secure` flag in HTTPS
    },
    name: 'harmonie_auth_session',
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
      role: attributes.role,
    };
  },
});

export const originMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'GET') {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  const hostHeader = req.headers.host ?? null;

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [
      hostHeader,
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
    ])
  ) {
    return res.status(403);
  }
  return next();
};

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize()
    );
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
};

export const isAuthenticatedMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user) {
    return res.status(401).json({
      message: 'You are not authenticated',
    });
  }
  return next();
};

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      email_verified: boolean;
      role: Role;
    };
  }
}
