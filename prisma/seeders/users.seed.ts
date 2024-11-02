import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  await prisma.users.createMany({
    data: [
        {
          "name": "user1",
          "email": "user1@example.com",
          "password": password,
        },
        {
          "name": "user2",
          "email": "user2@example.com",
          "password": password,
        },
  ]
  });
}

