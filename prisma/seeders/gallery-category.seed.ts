import { PrismaClient } from '@prisma/client';

export async function seedGalleryCategories(prisma: PrismaClient) {
  // Ambil semua galleries dan categories
  const galleries = await prisma.galleries.findMany();
  const categories = await prisma.categories.findMany();

  // Pastikan data galleries dan categories sudah ada
  if (galleries.length === 0 || categories.length === 0) {
    throw new Error("Seed galleries and categories before seeding gallery_categories.");
  }

  // Buat hubungan antara galleries dan categories
  const galleryCategoriesData = [
    {
      gallery_id: galleries[0].id,
      category_id: categories[0].id,
    },
    {
      gallery_id: galleries[1].id,
      category_id: categories[1].id,
    },
    {
      gallery_id: galleries[2].id,
      category_id: categories[2].id,
    },
    {
      gallery_id: galleries[3].id,
      category_id: categories[0].id, // Misal, galeri terakhir masuk ke kategori pertama
    },
  ];

  await prisma.gallery_categories.createMany({
    data: galleryCategoriesData,
  });
}
