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

  async findAll() {
    return this.prisma.contact_us.findMany();
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
