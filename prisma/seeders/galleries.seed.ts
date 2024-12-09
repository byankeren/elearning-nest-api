import { PrismaClient } from '@prisma/client';

export async function seedGalleries(prisma: PrismaClient) {
  await prisma.galleries.createMany({
    data: [
        {
          "name": "Abyan",
          "img": '/img-1733732285436.jpg',
          "desc" : "lorem",
        },
        {
          "name": "Chico",
          "desc" : "lorem",
          "img": '/img-1733732285436.jpg',
        },
        {
          "name": "Dewangga",
          "desc" : "lorem",
          "img": '/img-1733732285436.jpg',
        },
        {
          "name": "Rizki",
          "desc" : "lorem",
          "img": '/img-1733732285436.jpg',
        },
  ]
  });
}

