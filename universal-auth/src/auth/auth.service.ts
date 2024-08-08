import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthTokenPair } from './interfaces/token.interface';
import { hash as bcryptHash, compare } from 'bcrypt';
import { TokenService } from './token.service';
import { IGoogleUserData } from './interfaces/google-user-data.interface';
import { IFacebookUserData } from './interfaces/facebook-user-data.interface';
import { IExternalAuthUserData } from './interfaces/external-auth-user-data.interface';
import { UserAuthType } from 'src/user/enums/user-auth-type.enum';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthConfig } from 'src/config/auth.config';
import { MailNotificationService } from 'src/notifications/mail-notifications.service';
import { ServerConfig } from 'src/config/server.config';
import { TokenType } from './types/tokens.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly config: AuthConfig,
    private readonly serverConfig: ServerConfig,
    private readonly mailService: MailNotificationService,
  ) {}

  async validateUser(id: string): Promise<User> {
    return this.userService.getOneById(id);
  }

  async register(input: RegisterDto): Promise<User> {
    const user = await this.userService.findOneByEmail(input.email);
    if(user) {
      throw new UnauthorizedException('User with this email already exists');
    }
    const userParsed: Partial<User> = {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      hash: await bcryptHash(input.password, this.config.getSaltRounds()),
    };
    return this.userService.create(userParsed);
  }

  async login(input: LoginDto): Promise<AuthTokenPair> {
    const user = await this.userService.getOneByEmail(input.email);
    if(!user.hash) {
      throw new UnauthorizedException('This method of authentication is not supported for this user');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('User is not found');
    }
    const isPasswordValid = await compare(input.password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.tokenService.generateTokens(user._id.toString(), user.type);
  }


  async resetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const {id, token} = await this.tokenService.generatePasswordResetToken(user._id.toString());
    const resetLink = `${this.serverConfig.getFrontendUrl()}/auth/reset-password?id=${id}&token=${token}`;
    console.log(id, token);
    await this.mailService.sendMail(user.email, 'Reset password', `Reset password link will be active for 10 minutes ${resetLink}`);
  }

  async changePassword(id: string, token: string, password: string) {
    const tokenFromDb = await this.tokenService.findById(id);
    if (!tokenFromDb) {
      throw new NotFoundException('Token not found');
    }
    if(!await compare(token, tokenFromDb.hash)) {
      throw new UnauthorizedException('Malformed token');
    }
    if(tokenFromDb.usedAt) {
      throw new UnauthorizedException('Token has been used');
    }
    const decodedToken = await this.tokenService.decodeToken(token);
    if (decodedToken.tokenType !== TokenType.ResetPassword) {
      throw new UnauthorizedException('Invalid token //type');
    }
    const user = await this.userService.getOneById(decodedToken.userId);
    if(!user.authType.includes(UserAuthType.Local)) {
      user.authType.push(UserAuthType.Local);
    }
    await this.userService.upsert({id: decodedToken.userId, hash: await bcryptHash(password, this.config.getSaltRounds()), authType: user.authType});
    await this.tokenService.invalidateToken(id);
  }

  serializeExternalAuthData(userData: IGoogleUserData | IFacebookUserData): IExternalAuthUserData {
    return {
      email: 'email' in userData ? userData.email : '',
      firstName: 'given_name' in userData ? userData.given_name : 'firstName' in userData ? userData.firstName : '',
      lastName: 'family_name' in userData ? userData.family_name : 'lastName' in userData ? userData.lastName : '',
      picture: 'picture' in userData ? userData.picture : '',
    };
  }

  async externalAuth(data: IExternalAuthUserData, authType: UserAuthType): Promise<AuthTokenPair> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      const userParsed: Partial<User> = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        picture: data.picture,
        status: UserStatus.ACTIVE,
        authType: [authType],
      };
      const userCreated = await this.userService.create(userParsed);
      return this.tokenService.generateTokens(userCreated._id.toString(), userCreated.type);
    }
    if(user && !user.authType.includes(authType)) {
      user.authType.push(authType);
      await this.userService.upsert(user);
    }
    return this.tokenService.generateTokens(user._id.toString(), user.type);
  }

}