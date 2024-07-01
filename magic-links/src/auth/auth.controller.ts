// auth.controller.ts
import {
  Controller,
  Req,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { MagicLoginStrategy } from './strategy/magiclink.strategy';
import { PwdLessLoginDto } from './dto/pwdless-login.dto';
import { TokenService } from './token.service';
import { Public } from 'src/common/decorators/public.decorator';
import { MagicService } from './magic.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private strategy: MagicLoginStrategy,
    private magicService: MagicService,
  ) {}

  @Public()
  @Post('login/magic')
  async login(@Body(new ValidationPipe()) body: PwdLessLoginDto) {
    return this.magicService.login(body.destination);
  }

  @Public()
  @Post('register/magic')
  async register(@Body(new ValidationPipe()) body: PwdLessLoginDto) {
    return this.magicService.register(body.destination);
  }

  @Public()
  @Get('magic')
  async magicCallback(@Query('token') token: string) {
    return await this.magicService.callback(token);
  }

  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  async callback(@Req() req) {
    // return req.user;
    const user = await this.authService.validateUser(req.user.email);
    return this.tokenService.generateTokens(user.email, user.type);
  }
}
