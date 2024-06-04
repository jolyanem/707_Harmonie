import { Lucia, verifyRequestOrigin } from 'lucia';
import { adapter } from './db.js';
import type { Role } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'PRODUCTION',
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
