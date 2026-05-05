import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__prisma ?? new PrismaClient();

globalForPrisma.__prisma = prisma;

export default prisma;

