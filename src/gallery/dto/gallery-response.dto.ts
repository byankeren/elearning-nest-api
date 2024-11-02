import { galleries } from '@prisma/client';

export class GalleryResponseDto {
  data: galleries[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
