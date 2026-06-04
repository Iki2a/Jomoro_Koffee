import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  async getProfile(@Request() req) {
    return this.profilesService.getProfile(req.user.id);
  }
}
