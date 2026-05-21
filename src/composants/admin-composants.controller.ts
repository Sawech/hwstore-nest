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
  AdminComposantDto,
  AdminCreateComposantDto,
  AdminUpdateComposantDto,
} from './dto/composants.dto';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { ComposantsService } from './composants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('admin/composants')
@UseGuards(AdminJwtGuard)
export class AdminComposantsController {
  constructor(private readonly composantsService: ComposantsService) {}

  @Get()
  adminFindAll(@Query() query: AdminComposantDto) {
    return this.composantsService.adminFindAll(query);
  }

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.composantsService.uploadImage(file);
  }

  @Get(':id')
  adminFindOne(@Param('id') id: number) {
    return this.composantsService.adminFindOne(id);
  }

  @Post()
  create(@Body() dto: AdminCreateComposantDto) {
    return this.composantsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: AdminUpdateComposantDto) {
    return this.composantsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.composantsService.remove(id);
  }
}
