import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/cart/cart.entity';
import { Composant } from 'src/composants/composants.entity';
import { User } from 'src/user/user.entity';
import { Repository, MoreThan } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Composant)
    private readonly composantRepo: Repository<Composant>,
  ) {}

  async getDashboardStats() {
    const since = new Date();
    since.setMonth(since.getMonth() - 1);

    const [commandes, totalCommandes] = await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'item')
      .leftJoinAndSelect('cart.user', 'user')
      .where('cart.createdAt > :since', { since })
      .orderBy('cart.createdAt', 'DESC')
      .getManyAndCount();

    const users = await this.userRepo.count({
      where: { createdAt: MoreThan(since) },
    });

    const composants = await this.composantRepo.count({
      where: { createdAt: MoreThan(since) },
    });

    return { commandes, totalCommandes, users, composants };
  }
}
