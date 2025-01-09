import { Controller, Get, Post, Body, Patch, Param, Delete,Query ,UseGuards} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery ,ApiBearerAuth} from '@nestjs/swagger';
import { ContactUsResponseDto } from './dto/contactus-response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Controller('contact-us')
@ApiTags('Contact Us')
@UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('jwt')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a contact us record' })
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @Permissions('view-mailbox')
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No contact messages found.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of messages to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number to retrieve',
    example: 1,
  })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ): Promise<ContactUsResponseDto> {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.contactUsService.findAll(limitNumber, pageNumber);
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
  @Permissions('delete-mailbox')
  @ApiOperation({ summary: 'Delete a contact us record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the contact us record to delete' })
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(id);
  }
}
