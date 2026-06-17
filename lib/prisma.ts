import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function make() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL missing')
  // @ts-ignore — Prisma 7 internal override
  return new PrismaClient({ __internal: { configOverride: { datasources: { db: { url } } } } })
}

export const prisma = globalForPrisma.prisma ?? make()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma