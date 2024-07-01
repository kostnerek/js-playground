// auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { PwdLessLoginDto } from './dto/pwdless-login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { MagicService } from './magic.service';

@Controller('auth')
export class AuthController {
  constructor(private magicService: MagicService) {}

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
}
