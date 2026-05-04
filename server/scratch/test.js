import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (error) {
    console.error('Test error:', error);
  }
}
test();
