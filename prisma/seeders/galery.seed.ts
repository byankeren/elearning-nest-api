import { PrismaClient } from '@prisma/client';


export async function seedGalleries(prisma: PrismaClient) {
  await prisma.galleries.createMany({
    data: [
        {
          "name": "Tes",
          "desc": "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo labore numquam ea voluptatum, quia beatae veritatis, provident soluta at, dicta earum ullam magnam. Accusantium dolore quia tempora, voluptas necessitatibus nostrum.",
          
        },
        {
          "name": "Tes",
          "desc": "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo labore numquam ea voluptatum, quia beatae veritatis, provident soluta at, dicta earum ullam magnam. Accusantium dolore quia tempora, voluptas necessitatibus nostrum.",
          
        },
        {
          "name": "Tes",
          "desc": "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo labore numquam ea voluptatum, quia beatae veritatis, provident soluta at, dicta earum ullam magnam. Accusantium dolore quia tempora, voluptas necessitatibus nostrum.",
          
        },
        {
          "name": "Tes",
          "desc": "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo labore numquam ea voluptatum, quia beatae veritatis, provident soluta at, dicta earum ullam magnam. Accusantium dolore quia tempora, voluptas necessitatibus nostrum.",
          
        },
  ]
  });
}

