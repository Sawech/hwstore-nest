import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from 'src/cart/cart.entity';
import { Composant } from 'src/composants/composants.entity';
import { User } from 'src/user/user.entity';
import { AdminDashboardController } from './admin-dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Cart, User, Composant])],
  controllers: [AdminDashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
