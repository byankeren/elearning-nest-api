import { users } from '@prisma/client';

export class UserResponseDto {
  data: users[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
