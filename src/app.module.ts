import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComposantsModule } from './composants/composants.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

import { BuilderModule } from './builder/builder.module';
import { CartModule } from './cart/cart.module';
import { Composant } from './composants/composants.entity';
import { Category } from './category/category.entity';
import { SubCategory } from './sub-category/sub-category.entity';

import { User } from './user/user.entity';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Cart, CartItem } from './cart/cart.entity';
import { DashboardModule } from './dashboard/dashboard.module';
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
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Cart, CartItem, Composant, Category, SubCategory, User],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
        logging: config.get<boolean>('DB_LOGGING', true),
        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    ComposantsModule,
    CategoryModule,
    SubCategoryModule,

    BuilderModule,
    DashboardModule,
    CartModule,
    AuthModule,

    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Composant,
      Category,
      SubCategory,
    ]),
  ],
  providers: [AppService],
})
export class AppModule {}
