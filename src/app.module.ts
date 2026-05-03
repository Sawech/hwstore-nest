import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ConfiguratorModule } from './configurator/configurator.module';
import { CartModule } from './cart/cart.module';
import { Product } from './products/product.entity';
import { Category } from './category/category.entity';
import { SubCategory } from './sub-category/sub-category.entity';
import { ConfiguratorComponent } from './configurator/configurator-component.entity';
import { User } from './user/user.entity';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Cart, CartItem } from './cart/cart.entity';
// import { DatabaseSeederService } from './database/database-seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'hwstore'),
        entities: [
          Cart,
          CartItem,
          Product,
          Category,
          SubCategory,
          ConfiguratorComponent,
          User,
        ],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
        logging: config.get<boolean>('DB_LOGGING', true),
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    ProductsModule,
    CategoryModule,
    SubCategoryModule,
    ConfiguratorModule,
    CartModule,
    AuthModule,

    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Product,
      Category,
      SubCategory,
      ConfiguratorComponent,
    ]),
  ],
  providers: [AppService],
})
export class AppModule {}
