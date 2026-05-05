import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  const artists = await prisma.artist.findMany();
  console.log('--- USERS ---');
  console.log(users);
  console.log('--- ARTISTS ---');
  console.log(artists);
}
main().finally(() => prisma.$disconnect());
