import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);
  const superAdminPassword = await bcrypt.hash("superadmin", 10);
  const superAdminRole = await prisma.roles.findFirst({
    where: {
      slug: 'super-admin'
    }
  })
  const adminRole = await prisma.roles.findFirst({
    where: {
      slug: 'admin'
    }
  })
  await prisma.users.createMany({
    data: [
        {
          "name": "Super Admin",
          "email": "superadmin@example.com",
          "password": superAdminPassword,
          role_id: superAdminRole.id
        },
        {
          "name": "Muhamad Abyan Riyadh Amal",
          "email": "user1@example.com",
          "password": password,
          "image": '/abyan.jpg',
          role_id: adminRole.id
        },
        {
          "name": "Chico Arjuna Nugroho",
          "email": "user2@example.com",
          "password": password,
          "image": '/chico.jpg',
          role_id: adminRole.id
        },
        {
          "name": "Dewangga Mustika Dwipayana",
          "email": "user3@example.com",
          "password": password,
          "image": '/dedew.jpg',
          role_id: adminRole.id
        },
        {
          "name": "Muhamad Rizki Herdiansyah",
          "email": "user4@example.com",
          "password": password,
          role_id: adminRole.id
        },
  ]
  });
}

