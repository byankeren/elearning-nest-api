import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('contact-us')
@ApiTags('Contact Us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a contact us record' })
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all contact us records' })
  findAll() {
    return this.contactUsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a contact us record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the contact us record' })
  findOne(@Param('id') id: string) {
    return this.contactUsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact us record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the contact us record to update' })
  update(@Param('id') id: string, @Body() updateContactUsDto: UpdateContactUsDto) {
    return this.contactUsService.update(id, updateContactUsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact us record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the contact us record to delete' })
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(id);
  }
}
