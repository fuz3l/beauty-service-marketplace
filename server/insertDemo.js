import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = `demo_${Date.now()}@example.com`;
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Elena Rossi',
      password: hashedPassword,
      role: 'artist',
      artistProfile: {
        create: {
          isVerified: true,
          location: 'Milan, Italy',
          speciality: 'High Fashion & Bridal',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
          services: {
            create: [
              { title: 'Luxury Bridal Package', price: 40000, serviceType: 'bridal' },
              { title: 'Editorial Look', price: 15000, serviceType: 'party' }
            ]
          },
          portfolio: {
            create: [
              { url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80' },
              { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' }
            ]
          }
        }
      }
    }
  });

  console.log('✅ Demo artist inserted successfully!');
  console.log('Email:', user.email);
  console.log('Password: password123');
  console.log('Location: Milan, Italy');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
