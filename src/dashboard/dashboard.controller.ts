import { Controller, Get ,UseGuards} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';


@ApiTags('Dashboard')
@Controller('dashboard')
// @UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
// @ApiBearerAuth('jwt')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get total counts of users, galleries, and contacts' })
  async getDashboardCounts() {
    return await this.dashboardService.getDashboardCounts();
  }
  
  @Get('monthly-data')
  async getMonthlyData() {
    return this.dashboardService.monthlyData();
  }
  

}
