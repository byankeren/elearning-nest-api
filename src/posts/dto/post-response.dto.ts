import { posts } from '@prisma/client';

export class PostResponseDto {
  data: posts[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
