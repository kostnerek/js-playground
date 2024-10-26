import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthInvalidPasswordError } from './errors/auth-invalid-password.error';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new NotFoundException(AuthInvalidPasswordError);
  }
}
