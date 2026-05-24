import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import {
  AdminCartDto,
  CartContextDto,
  CartDto,
  Item,
  UpdateCartStatusDto,
} from './dto/cart.dto';
import { CartStatus } from './cart.entity';

@Injectable()
export class CartService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://pay.chargily.net/test/api/v2';
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {
    const key = process.env.CHARGILY_SECRET_KEY;
    if (!key) throw new Error('CHARGILY_SECRET_KEY is not set');
    this.apiKey = key;
  }

  async findAll(ctx: CartContextDto) {
    const where = ctx.userId
      ? { user: { id: ctx.userId }, status: 'active' as const }
      : { sessionToken: ctx.sessionToken, status: 'active' as const };

    let carts = await this.cartRepo.find({
      where,
      relations: ['items', 'items.composant'],
    });

    if (!carts) {
      const cart = this.cartRepo.create({
        status: 'active',
        ...(ctx.userId ? { user: { id: ctx.userId } } : {}),
        ...(ctx.sessionToken ? { sessionToken: ctx.sessionToken } : {}),
        items: [],
      });
      await this.cartRepo.save(cart);
      carts = [cart];
    }

    return carts;
  }

  async findOne(id: number) {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['items', 'items.composant'],
    });

    if (!cart) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return cart;
  }

  async createCart(dto: CartDto) {
    const items = dto.items;
    const userId = dto.userId;
    const count = await this.cartRepo.count();
    const year = new Date().getFullYear().toString().slice(-2);
    const orderRef = `HW-${year}-${String(count + 1).padStart(5, '0')}`;
    const cart = this.cartRepo.create({
      status: 'active',
      orderRef,
      totalPrice: dto.totalPrice,
      user: { id: userId },
      items: items.map((i: Item) => ({
        composant: { id: i.composantId },
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });

    return this.cartRepo.save(cart);
  }

  async adminFindAll(query: AdminCartDto) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'item')
      .leftJoinAndSelect('cart.user', 'user')
      .orderBy('cart.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      qb.andWhere('cart.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR cart.orderRef ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [carts, total] = await qb.getManyAndCount();

    return {
      data: carts.map((cart) => ({
        ...cart,
        user: cart.user
          ? {
              id: cart.user.id,
              firstName: cart.user.firstName,
              lastName: cart.user.lastName,
              email: cart.user.email,
            }
          : null,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id: number, dto: UpdateCartStatusDto) {
    const cart = await this.cartRepo.findOne({ where: { id } }); // missing await
    if (!cart) throw new NotFoundException(`Cart #${id} not found`);
    cart.status = dto.status as CartStatus;
    return this.cartRepo.save(cart);
  }

  // async mergeGuestCart(sessionToken: string, userId: number) {
  //   // Find the guest cart
  //   const guestCart = await this.cartRepo.findOne({
  //     where: { sessionToken, status: 'active' },
  //     relations: ['items'],
  //   });

  //   if (!guestCart) return { merged: false, message: 'No guest cart found' };

  //   // Find or create the user cart
  //   let userCart = await this.cartRepo.findOne({
  //     where: { user: { id: userId }, status: 'active' },
  //     relations: ['items'],
  //   });

  //   if (!userCart) {
  //     userCart = this.cartRepo.create({
  //       user: { id: userId },
  //       status: 'active',
  //       items: [],
  //     });
  //     await this.cartRepo.save(userCart);
  //   }

  //   // Merge items — if same composant+variant exists, add quantities
  //   for (const guestItem of guestCart.items) {
  //     const existing = userCart.items.find(
  //       (i) =>
  //         i.composant.id === guestItem.composant.id &&
  //         i.variant === guestItem.variant,
  //     );
  //     if (existing) {
  //       existing.quantity += guestItem.quantity;
  //     } else {
  //       userCart.items.push({ ...guestItem, cart: userCart });
  //     }
  //   }

  //   await this.cartRepo.save(userCart);

  //   // Mark guest cart as merged
  //   guestCart.status = 'merged';
  //   await this.cartRepo.save(guestCart);

  //   return { merged: true, cartId: userCart.id };
  // }

  // async createCheckout(amount: number, items: any[], userId?: number) {
  //   const response = await fetch(`${this.apiUrl}/checkouts`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${this.apiKey}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       amount,
  //       currency: 'dzd',
  //       success_url: 'http://localhost:4200/success',
  //       failure_url: 'http://localhost:4200/panier',
  //       metadata: { items, userId: userId ?? null },
  //     }),
  //   });
  //   const data = await response.json();
  //   return { checkout_url: data.checkout_url };
  // }

  // async handleWebhook(signature: string, rawBody: Buffer) {
  //   if (!signature) throw new BadRequestException('Missing signature');

  //   const computed = crypto
  //     .createHmac('sha256', this.apiKey)
  //     .update(rawBody)
  //     .digest('hex');

  //   if (
  //     !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed))
  //   ) {
  //     throw new ForbiddenException('Invalid signature');
  //   }

  //   const event = JSON.parse(rawBody.toString());

  //   if (event.type === 'checkout.paid') {
  //     const checkout = event.data;
  //     const items = checkout.metadata?.items ?? [];
  //     const userId = checkout.metadata?.userId ?? null;
  //     const count = await this.cartRepo.count();
  //     const year = new Date().getFullYear().toString().slice(-2);
  //     const orderRef = `HW-${year}-${String(count + 1).padStart(5, '0')}`;
  //     const cart = this.cartRepo.create({
  //       status: 'active',
  //       sessionToken: checkout.id,
  //       orderRef,
  //       ...(userId ? { user: { id: userId } } : {}),
  //       items: items.map((i: any) => ({
  //         composant: { id: i.composantId },
  //         quantity: i.quantity,
  //         unitPrice: i.unitPrice,
  //       })),
  //     });

  //     await this.cartRepo.save(cart);
  //   } else if (event.type === 'checkout.failed') {
  //   }

  //   return { received: true };
  // }

  // async getBill(checkoutId: string) {
  //   const response = await fetch(
  //     `https://pay.chargily.net/test/api/v2/payment-links/${checkoutId}`,

  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${this.apiKey}`,
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );
  //   return response.json();
  // }

  async getUserCarts(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [carts, total] = await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'item')
      .leftJoinAndSelect('item.composant', 'composant')
      .where('cart.user_id = :userId', { userId })
      .orderBy('cart.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: carts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // async getOrderByCheckoutId(checkoutId: string) {
  //   const cart = await this.cartRepo.findOne({
  //     where: { sessionToken: checkoutId },
  //   });
  //   if (!cart) return null;
  //   return cart;
  // }
}
