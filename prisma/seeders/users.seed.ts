import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  await prisma.users.createMany({
    data: [
        {
          "name": "Abyan",
          "email": "user1@example.com",
          "password": password,
          "image": '/img-1733732285436.jpg',
        },
        {
          "name": "Chico",
          "email": "user2@example.com",
          "password": password,
          "image": '/img-1733732285436.jpg',
        },
        {
          "name": "Dewangga",
          "email": "user3@example.com",
          "password": password,
        },
        {
          "name": "Rizki",
          "email": "user4@example.com",
          "password": password,
        },
  ]
  });
}

