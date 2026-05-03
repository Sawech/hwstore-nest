import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { CartService } from './cart.service';
import { AdminCartDto, UpdateCartStatusDto } from './dto/cart.dto';

@Controller('admin/cart')
@UseGuards(AdminJwtGuard)
export class AdminCartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  findAll(@Query() query: AdminCartDto) {
    return this.cartService.adminFindAll(query);
  }
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartStatusDto,
  ) {
    return this.cartService.updateStatus(id, dto);
  }
}
