import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardCounts() {
    const totalUsers = await this.prisma.users.count();
    const totalGalleries = await this.prisma.galleries.count();


    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const totalContacts = await this.prisma.contact_us.count({
      where: {
        createdAt: {
          gte: oneWeekAgo, 
        },
      },
    });

    return {
      totalUsers,
      totalGalleries,
      totalContacts,
    };
  }

}
