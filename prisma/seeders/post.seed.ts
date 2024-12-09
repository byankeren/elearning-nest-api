import { PrismaClient } from '@prisma/client';

export async function seedPosts(prisma: PrismaClient) {
  const users = await prisma.users.findMany();
  if (users.length === 0) {
    throw new Error("Seed users before seeding posts.");
  }

  const postsData = [
    {
      img: '/img-1733732285436.jpg',
      title: 'How to Learn Prisma',
      slug: 'how-to-learn-prisma',
      user_id: users[0].id,
      desc: 'A comprehensive guide to learning Prisma.',
      read_time: 5,
      views: 120,
    },
    {
      img: '/img-1733732285436.jpg',
      title: 'Understanding JavaScript Closures',
      slug: 'understanding-javascript-closures',
      user_id: users[1]?.id || users[0].id, 
      desc: 'An in-depth explanation of JavaScript closures.',
      read_time: 8,
      views: 340,
    },
    {
      img: '/img-1733732285436.jpg',
      title: '10 Tips for Better Coding',
      slug: '10-tips-for-better-coding',
      user_id: users[2]?.id || users[0].id,
      desc: 'Tips and tricks to improve your coding skills.',
      read_time: 6,
      views: 270,
    },
    {
      img: '/img-1733732285436.jpg',
      title: 'Exploring TypeScript Features',
      slug: 'exploring-typescript-features',
      user_id: users[3]?.id || users[0].id,
      desc: 'A detailed look into TypeScript’s powerful features.',
      read_time: 7,
      views: 150,
    },
  ];

  await prisma.posts.createMany({
    data: postsData,
  });

}
