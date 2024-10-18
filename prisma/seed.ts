import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/users.seed';
const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

