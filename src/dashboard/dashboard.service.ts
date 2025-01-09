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

  private getStartOfMonth(date: Date) {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return startOfMonth;
  }

  private getEndOfMonth(date: Date) {
    const endOfMonth = new Date(date);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth;
  }

  private async getCountsPerMonth(modelName: string, startDate: Date) {
    const currentDate = new Date();

    // Mengambil total id per bulan berdasarkan created_at untuk model yang diberikan
    const records = await this.prisma[modelName].groupBy({
      by: ['created_at'],
      _count: {
        id: true, // Menghitung total id
      },
      where: {
        created_at: {
          gte: startDate, // Mulai dari 5 bulan yang lalu
          lte: currentDate, // Hingga saat ini
        },
      },
      orderBy: {
        created_at: 'asc', // Mengurutkan hasil berdasarkan tanggal
      },
    });

    // Mengelompokkan berdasarkan bulan dan tahun
    const countsPerMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentDate);
      monthStart.setMonth(currentDate.getMonth() - i);

      const monthKey = monthStart.toLocaleString('default', { month: 'long', year: 'numeric' });
      const monthCount = records
        .filter((record) => {
          const recordMonth = new Date(record.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
          return recordMonth === monthKey;
        })
        .reduce((total, record) => total + record._count.id, 0);

      countsPerMonth.push({
        month: monthKey,
        count: monthCount,
      });
    }

    return countsPerMonth;
  }

  async monthlyData() {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5); // Mulai dari 5 bulan yang lalu
    const currentDate = new Date();
  
    // Ambil data dari kedua tabel
    const galleriesData = await this.getCountsPerMonth('galleries', startDate);
    const postDetailsData = await this.getCountsPerMonth('post_details', startDate);
  
    // Gabungkan data berdasarkan bulan
    const result = galleriesData.map((gallery, index) => ({
      month: gallery.month,
      galleries: gallery.count,
      post_details: postDetailsData[index]?.count || 0, // Default 0 jika tidak ada data
    }));
  
    return result;
  }
  
}
