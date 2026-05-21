import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
@UseGuards(AdminJwtGuard)
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('sales-chart')
  getSalesChart() {
    const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    const heights = [40, 55, 75, 90, 65, 45, 30];
    return days.map((day, i) => ({
      day,
      value: heights[i],
      height: `${heights[i]}%`,
    }));
  }
}
