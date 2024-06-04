import { Lucia } from 'lucia';
import { adapter } from './db.js';
import type { Role } from '@prisma/client';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'PRODUCTION',
      domain: process.env.FRONTEND_URL,
    },
    name: 'harmonie_auth_session',
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
      role: attributes.role,
      name: attributes.name,
      surname: attributes.surname,
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
      name: string;
      surname: string;
    };
  }
}
