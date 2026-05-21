/**
 * HWstore — Category Module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AdminCategoryController } from './admin-category.controller';
import { SubCategory } from 'src/sub-category/sub-category.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory]), AuthModule],
  controllers: [CategoryController, AdminCategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
