// auth.controller.ts
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Auth2faDto } from './dto/auth2fa.dto';
import { Toggle2FADto } from './dto/toggle2FA.dto';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { UserService } from 'src/user/user.service';
import { InjectUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  @Public()
  async register(@Body() body: AuthDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  @Public()
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }

  @Post('login/2fa')
  @Public()
  async login2FA(@Body() body: Auth2faDto) {
    return this.authService.login2Fa(body);
  }

  @Post('2fa/generate')
  async generate2FA(@InjectUser() user: User) {
    const { otpAuthUrl } = await this.otpService.generate2FASecret(user);
    return this.otpService.generateQrCode(otpAuthUrl);
  }

  @Post('2fa/toggle')
  async change2FAStatus(@InjectUser() user: User, @Body() body: Toggle2FADto) {
    const isCodeValid = await this.otpService.is2FACodeValid(body.token, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.userService.change2FAStatus(user._id.toString(), body.status);
  }
}
