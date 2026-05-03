import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfiguratorService } from './configurator.service';
import { CalculateBuildDto } from './dto/calculate-build.dto';

@Controller('configurator')
export class ConfiguratorController {
  constructor(private readonly configuratorService: ConfiguratorService) {}

  @Get('components')
  findAll(@Query('type') type?: string) {
    return this.configuratorService.findAll(type);
  }

  @Post('calculate')
  calculate(@Body() dto: CalculateBuildDto) {
    return this.configuratorService.calculate(dto);
  }
}
