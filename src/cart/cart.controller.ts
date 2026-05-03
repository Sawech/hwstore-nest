import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  Req,
  HttpCode,
  BadRequestException,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { CartContextDto } from './dto/cart.dto';
import { UserJwtGuard } from '../auth/guards/user-jwt.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getContext(req: any, sessionToken?: string): CartContextDto {
    return {
      userId: req.user?.id ?? undefined,
      sessionToken: sessionToken ?? undefined,
    };
  }

  @Get()
  getCart(@Req() req: any, @Headers('x-session-token') sessionToken?: string) {
    return this.cartService.findAll(this.getContext(req, sessionToken));
  }

  @Get('orders')
  @UseGuards(UserJwtGuard)
  getUserCarts(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ) {
    return this.cartService.getUserCarts(req.user.sub, page, limit);
  }

  @Get('bill/:checkoutId')
  getBill(@Param('checkoutId') checkoutId: string) {
    return this.cartService.getBill(checkoutId);
  }

  @Get(':checkoutId')
  getOrderByCheckoutId(@Param('checkoutId') checkoutId: string) {
    return this.cartService.getOrderByCheckoutId(checkoutId);
  }

  @Post('checkout')
  async createCheckout(
    @Body() body: { amount: number; items: any[]; userId?: number },
  ) {
    return this.cartService.createCheckout(
      body.amount,
      body.items,
      body.userId,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }
    return this.cartService.handleWebhook(signature, req.rawBody);
  }
}
