import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AdminCategoryDto,
  AdminCreateCategoryDto,
  AdminUpdateCategoryDto,
} from './dto/category.dto';
import { CategoryService } from './category.service';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';

@Controller('admin/category')
@UseGuards(AdminJwtGuard)
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() query: AdminCategoryDto) {
    return this.categoryService.adminFindAll(query);
  }

  @Post()
  create(@Body() dto: AdminCreateCategoryDto) {
    return this.categoryService.adminCreate(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateCategoryDto,
  ) {
    return this.categoryService.adminUpdate(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.adminRemove(id);
  }
}
