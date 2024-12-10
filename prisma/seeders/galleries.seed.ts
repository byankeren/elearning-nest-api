import { PrismaClient } from '@prisma/client';

export async function seedGalleries(prisma: PrismaClient) {
  await prisma.galleries.createMany({
    data: [
        {
          "name": "T-SHOP",
          "img": '/Screenshot-51.png',
          "desc" : "lorem",
        },
        {
          "name": "BIZZBUD",
          "desc" : "lorem",
          "img": '/Screenshot-52.png',
        },
        {
          "name": "BACK2SCHOOL",
          "desc" : "lorem",
          "img": '/Screenshot-54.png',
        },
        {
          "name": "ZOZO GAMES",
          "desc" : "lorem",
          "img": '/Screenshot-53.png',
        },
  ]
  });
}

