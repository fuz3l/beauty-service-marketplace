import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    // Check if seeded
    const existing = await prisma.user.findFirst({ where: { email: 'artist@seed.com' }});
    if (existing) {
      console.log('Already seeded');
      return;
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    // Create Artist User
    const artistUser = await prisma.user.create({
      data: {
        email: 'artist@seed.com',
        password: hashedPassword,
        name: 'Jane Smith',
        role: 'artist',
        artistProfile: {
          create: {
            isVerified: true,
            location: 'Mumbai, India',
            speciality: 'Bridal, HD Makeup',
            avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
          }
        }
      },
      include: { artistProfile: true }
    });

    // Create Service
    const service = await prisma.service.create({
      data: {
        artistId: artistUser.artistProfile.id,
        title: 'Bridal Makeup',
        price: 15000,
        serviceType: 'bridal',
      }
    });

    // Create Review
    // Wait, review needs a client. Let's create a Client User.
    const clientUser = await prisma.user.create({
      data: {
        email: 'client@seed.com',
        password: hashedPassword,
        name: 'Sarah Client',
        role: 'client',
      }
    });

    await prisma.review.create({
      data: {
        artistId: artistUser.artistProfile.id,
        clientId: clientUser.id,
        rating: 4.8,
        comment: 'Absolutely amazing work!',
      }
    });

    // Create Bookings
    // 1 confirmed upcoming
    await prisma.booking.create({
      data: {
        clientId: clientUser.id,
        artistId: artistUser.artistProfile.id,
        serviceId: service.id,
        date: new Date(new Date().getTime() + 86400000 * 2), // 2 days from now
        time: '10:00 AM',
        status: 'confirmed',
      }
    });

    // 1 pending
    await prisma.booking.create({
      data: {
        clientId: clientUser.id,
        artistId: artistUser.artistProfile.id,
        serviceId: service.id,
        date: new Date(new Date().getTime() + 86400000 * 5),
        time: '02:00 PM',
        status: 'pending',
      }
    });

    // 1 completed
    await prisma.booking.create({
      data: {
        clientId: clientUser.id,
        artistId: artistUser.artistProfile.id,
        serviceId: service.id,
        date: new Date(new Date().getTime() - 86400000 * 5),
        time: '11:00 AM',
        status: 'completed',
      }
    });

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
