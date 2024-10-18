import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {

  // Seed Doctors
  await prisma.users.createMany({
    data: [
        {
            "email": "user1@example.com",
            "password": "password123",
        },
        {
            "email": "user2@example.com",
            "password": "password123",
        },
  ]
  });
}

