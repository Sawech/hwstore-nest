import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { SubCategoryDto } from './dto/sub-category.dto';

@Controller('admin/subcategory')
@UseGuards(AdminJwtGuard)
export class AdminSubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  adminFindAll() {
    return this.subCategoryService.adminGetAll();
  }

  @Post()
  create(@Body() dto: SubCategoryDto) {
    return this.subCategoryService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SubCategoryDto) {
    return this.subCategoryService.update(id, dto);
  }

  @Delete(':id')
  Remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.remove(id);
  }
}
