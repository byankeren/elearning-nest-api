import { PrismaClient } from '@prisma/client';

export async function seedGalleries(prisma: PrismaClient) {
  await prisma.galleries.createMany({
    data: [
        {
          "name": "Abyan",
          "img": '/Screenshot (56)-1733111600177.png',
          "desc" : "lorem",
        },
        {
          "name": "Chico",
          "desc" : "lorem",
          "img": '/Screenshot (55)-1733111600177.png',
        },
        {
          "name": "Dewangga",
          "desc" : "lorem",
          "img": '/Screenshot (54)-1733111600177.png',
        },
        {
          "name": "Rizki",
          "desc" : "lorem",
          "img": '/Screenshot (53)-1733111600177.png',
        },
  ]
  });
}

