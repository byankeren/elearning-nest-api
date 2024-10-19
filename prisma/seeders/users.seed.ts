import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  await prisma.users.createMany({
    data: [
        {
          "id":  uuidv4(),
          "email": "user1@example.com",
          "password": password,
        },
        {
          "id":  uuidv4(),
          "email": "user2@example.com",
          "password": password,
        },
  ]
  });
}

