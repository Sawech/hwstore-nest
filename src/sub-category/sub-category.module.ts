import { Module } from '@nestjs/common';
import { SubCategory } from './sub-category.entity';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSubCategoryController } from './admin-sub-category.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), AuthModule],
  controllers: [SubCategoryController, AdminSubCategoryController],
  exports: [SubCategoryService],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
