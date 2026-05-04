import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import readline from 'readline';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n✨ --- Create Custom Artist --- ✨\n');
  
  const name = await question('Artist Name: ');
  const email = await question('Email: ');
  const password = await question('Password: ');
  const location = await question('Location (e.g. Mumbai, India): ');
  const speciality = await question('Speciality (e.g. Bridal Makeup): ');

  console.log('\n⏳ Saving to database...');

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'artist',
        artistProfile: {
          create: {
            isVerified: true,
            location,
            speciality,
            avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
            services: {
              create: [
                { title: 'Signature Makeup Look', price: 5000, serviceType: 'party' },
                { title: 'Bridal Trial', price: 2000, serviceType: 'bridal' }
              ]
            },
            portfolio: {
              create: [
                { url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80' }
              ]
            }
          }
        }
      }
    });

    console.log('\n✅ Artist successfully added to database!');
    console.log(`Now go search for "${location}" on the Client Browse page!`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('\n❌ Error: An account with this email already exists.');
    } else {
      console.error('\n❌ Database Error:', error.message);
    }
  }

  rl.close();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
