import type { Response, NextFunction, Request } from 'express';
import { lucia } from './lucia.js';
import { verifyRequestOrigin } from 'lucia';

export async function originMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === 'GET') {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  const hostHeader = req.headers.host ?? null;

  console.log('Origin header', originHeader);
  console.log('Host header', hostHeader);

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [
      hostHeader,
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
    ])
  ) {
    console.log('Origin not allowed', originHeader, hostHeader);
    return res.status(403).json({
      message: 'Forbidden',
    });
  }
  return next();
}

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('session cookie', req.headers.cookie);

  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
  console.log('Sessionid', sessionId);

  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  console.log('Session validated', session);
  console.log('User validated', user);

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
