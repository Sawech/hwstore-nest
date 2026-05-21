/**
 * HWstore — Composants Controller
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ComposantsService } from './composants.service';
import { ComposantsDto } from './dto/composants.dto';

@Controller('composants')
export class ComposantsController {
  constructor(private readonly composantsService: ComposantsService) {}

  @Get()
  findAll(@Query() query: ComposantsDto) {
    return this.composantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.composantsService.findOne(id);
  }

  @Get('type/:type')
  findType(@Param('type') type: string) {
    return this.composantsService.findType(type);
  }
}
