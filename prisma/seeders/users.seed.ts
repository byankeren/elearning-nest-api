import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  await prisma.users.createMany({
    data: [
        {
          "name": "Muhamad Abyan Riyadh Amal",
          "email": "user1@example.com",
          "password": password,
        },
        {
          "name": "Chico Arjuna Nugroho",
          "email": "user2@example.com",
          "password": password,
        },
        {
          "name": "Dewangga Mustika Dwipayana",
          "email": "user3@example.com",
          "password": password,
        },
        {
          "name": "Muhamad Rizki Herdiansyah",
          "email": "user4@example.com",
          "password": password,
        },
  ]
  });
}

