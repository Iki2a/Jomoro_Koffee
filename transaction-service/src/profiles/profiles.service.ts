import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfilesService {
  private authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:3001',
    );
  }

  async getProfile(userId: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/user/${userId}`),
      );

      return {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
      };
    } catch (error) {
      throw new NotFoundException('User profile not found');
    }
  }
}
