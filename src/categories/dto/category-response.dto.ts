import { categories } from '@prisma/client';

export class CategoryResponseDto {
  data: categories[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
