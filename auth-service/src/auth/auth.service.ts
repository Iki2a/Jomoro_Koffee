import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  isLettersOnly,
  isValidEmail,
  isValidPassword,
} from '../common/validation.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Validate first_name: letters only
    if (!isLettersOnly(dto.first_name)) {
      throw new BadRequestException('First name must contain letters only');
    }

    // Validate last_name: letters only
    if (!isLettersOnly(dto.last_name)) {
      throw new BadRequestException('Last name must contain letters only');
    }

    // Validate email: must have valid domain
    if (!isValidEmail(dto.email)) {
      throw new BadRequestException(
        'Email must have a valid domain (.com, .net, .org, or .id)',
      );
    }

    // Validate password: min 8 chars, no spaces, at least 2 digits
    if (!isValidPassword(dto.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters, contain no spaces, and have at least 2 numeric digits',
      );
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create user — password stored in plain text per spec
    const user = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Plain text password comparison per spec
    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT with id and role in payload
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
    };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
