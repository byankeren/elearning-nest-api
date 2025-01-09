import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/users.seed';
import { seedCategories } from './seeders/categories.seed';
import { seedGalleryCategories } from './seeders/gallery-category.seed';
import { seedPosts } from './seeders/post.seed';
const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedPosts(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

