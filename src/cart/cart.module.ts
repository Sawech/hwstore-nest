import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AdminCartController } from './admin-cart.controller';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), AuthModule],
  controllers: [CartController, AdminCartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
