import { contact_us } from '@prisma/client';

export class ContactUsResponseDto {
  data: contact_us[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
