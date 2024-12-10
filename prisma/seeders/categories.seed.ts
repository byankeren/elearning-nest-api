import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  await prisma.categories.createMany({
    data: [
        {
          "title": "Bussines",

        },
        {
          "title": "Company Profile", 
        },
        {
          "title": "Olshop",
        },
  ]
  });
}

