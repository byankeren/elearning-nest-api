import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ContactUsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactUsDto) {
    return this.prisma.contact_us.create({
      data,
    });
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
  
    const [data, total] = await Promise.all([
      this.prisma.contact_us.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.contact_us.count(),
    ]);
  
    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact_us.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException(`Contact Us with ID ${id} not found`);
    }
    return contact;
  }

  async update(id: string, data: UpdateContactUsDto) {
    await this.findOne(id); // Check if the record exists
    return this.prisma.contact_us.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if the record exists
    return this.prisma.contact_us.delete({
      where: { id },
    });
  }
}
