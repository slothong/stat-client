import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const user = await this.usersService.create(username, password);
    return { id: user.id, username: user.username };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await this.usersService.validatePassword(user, password))) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
