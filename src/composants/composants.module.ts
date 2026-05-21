import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComposantsController } from './composants.controller';
import { ComposantsService } from './composants.service';
import { Composant } from './composants.entity';
import { AdminComposantsController } from './admin-composants.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Composant]), AuthModule],
  controllers: [ComposantsController, AdminComposantsController],
  providers: [ComposantsService, AppService],
  exports: [ComposantsService],
})
export class ComposantsModule {}
