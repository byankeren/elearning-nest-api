import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  await prisma.roles.createMany({
    data: [
      {
        "name": "Super Admin",
        "slug": 'super-admin'
      },
      {
        "name": "Admin",
        "slug": 'admin'
      },
    ]
  });
}

