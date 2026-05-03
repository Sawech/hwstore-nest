import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { AdminProductsController } from './admin-products.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService, AppService],
  exports: [ProductsService],
})
export class ProductsModule {}
