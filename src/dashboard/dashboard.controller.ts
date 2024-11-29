import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Dashboard')
@Controller('dashboard')
// @UseGuards(AuthGuard('jwt')) // Uncomment if using JWT authentication
// @ApiBearerAuth('jwt') // Uncomment if using JWT authentication
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get total counts of users, galleries, and contacts' })
  async getDashboardCounts() {
    return await this.dashboardService.getDashboardCounts();
  }
}
