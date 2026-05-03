import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AdminProductDto,
  AdminCreateProductDto,
  AdminUpdateProductDto,
} from './dto/products.dto';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('admin/components')
@UseGuards(AdminJwtGuard)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  adminFindAll(@Query() query: AdminProductDto) {
    return this.productsService.adminFindAll(query);
  }

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadImage(file);
  }

  @Get(':id')
  adminFindOne(@Param('id') id: number) {
    return this.productsService.adminFindOne(id);
  }

  @Post()
  create(@Body() dto: AdminCreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: AdminUpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
