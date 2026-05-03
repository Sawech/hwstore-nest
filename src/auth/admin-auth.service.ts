import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string; user: object }> {
    const adminEmail = this.config.get<string>(
      'ADMIN_EMAIL',
      'admin@hwstore.com',
    );
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD', 'admin123');

    if (dto.email !== adminEmail || dto.password !== adminPassword) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: 'admin', email: adminEmail, role: 'admin' };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: 'admin',
        email: adminEmail,
        name: 'Administrateur',
        role: 'admin',
      },
    };
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
