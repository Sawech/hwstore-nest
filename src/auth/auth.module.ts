import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AdminAuthService } from '../auth/admin-auth.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { UserAuthService } from '../auth/user-auth.service';
import { UserJwtGuard } from '../auth/guards/user-jwt.guard';

import { Composant } from '../composants/composants.entity';
import { User } from '../user/user.entity';

import { AdminAuthController } from './admin-auth.controller';
import { UserAuthController } from './user-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Composant, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(
          'JWT_SECRET',
          'hwstore_super_secret_jwt_key_2024',
        ),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AdminAuthController, UserAuthController],
  providers: [AdminAuthService, AdminJwtGuard, UserAuthService, UserJwtGuard],
  exports: [AdminAuthService, AdminJwtGuard, UserAuthService, UserJwtGuard],
})
export class AuthModule {}
