import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/users.seed';
import { seedCategories } from './seeders/categories.seed';
import { seedGalleryCategories } from './seeders/gallery-category.seed';
import { seedRoles } from './seeders/roles.seed';
import { seedPosts } from './seeders/post.seed';
import { seedRolePermissions } from './seeders/role-permissions';
const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma)
  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedPosts(prisma);
  await seedRolePermissions(prisma)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

