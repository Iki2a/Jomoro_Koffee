import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID (internal endpoint for service-to-service)' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUserById(id);
  }
}
