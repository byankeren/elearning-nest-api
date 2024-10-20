import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  await prisma.users.createMany({
    data: [
        {
          "email": "user1@example.com",
          "password": password,
        },
        {
          "email": "user2@example.com",
          "password": password,
        },
  ]
  });
}

