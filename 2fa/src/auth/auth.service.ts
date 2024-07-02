import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { hash as bcryptHash, compare } from 'bcrypt';
import { AuthConfig } from 'src/config/auth.config';
import { AuthTokenPair } from './interfaces/token.interface';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: AuthConfig,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(id: string): Promise<User> {
    return this.userService.getOneById(id);
  }

  async register(input: AuthDto): Promise<User> {
    await this.userService.findOneByEmail(input.email);
    const userParsed: Partial<User> = {
      email: input.email,
      hash: await bcryptHash(input.password, this.config.getSaltRounds()),
    };
    return this.userService.create(userParsed);
  }

  async login(input: AuthDto): Promise<AuthTokenPair> {
    const user = await this.userService.getOneByEmail(input.email);
    if (user.twoFactorAuthEnabled) {
      throw new UnauthorizedException('2FA is enabled');
    }
    const isPasswordValid = await compare(input.password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.tokenService.generateTokens(user._id.toString(), user.type);
  }

  async login2Fa(input: AuthDto): Promise<AuthTokenPair> {
    const user = await this.userService.getOneByEmail(input.email);
    const isPasswordValid = await compare(input.password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or token');
    }

    const isCodeValid = await this.otpService.is2FACodeValid(input.token, user);

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid password or token');
    }

    return this.tokenService.generateTokens(user._id.toString(), user.type);
  }
}
