import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { Product } from 'src/products/product.entity';

@Controller('admin/dashboard')
@UseGuards(AdminJwtGuard)
export class AdminDashboardController {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  @Get('stats')
  async getStats() {
    const totalProducts = await this.productRepo.count();

    return {
      totalUsers: Math.floor(Math.random() * 5000) + 10000,
      totalStock: totalProducts,
      salesTrend: 12.5,
      ordersTrend: 5.2,
      usersTrend: -2.1,
    };
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
