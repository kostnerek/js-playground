import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthTokenPair } from './interfaces/token.interface';
import { TokenService } from './token.service';
import { IFacebookUserData } from './interfaces/facebook-user-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(id: string): Promise<User> {
    return this.userService.getOneById(id);
  }

  async facebookAuth(data: IFacebookUserData): Promise<AuthTokenPair> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      const userParsed: Partial<User> = {
        email: data.email
      };
      const userCreated = await this.userService.create(userParsed);
      return this.tokenService.generateTokens(userCreated._id.toString());
    }
    return this.tokenService.generateTokens(user._id.toString());
  }

}
