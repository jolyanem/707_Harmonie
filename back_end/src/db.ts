import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';

const db = new PrismaClient();

const adapter = new PrismaAdapter(db.session, db.user);

export { adapter, db };
