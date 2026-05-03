import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}
  @Get()
  getAll() {
    return this.subCategoryService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.findOne(id);
  }
}
