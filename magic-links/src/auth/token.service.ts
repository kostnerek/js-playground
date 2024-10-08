import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthConfig } from 'src/config/auth.config';
import { TokenType } from './types/tokens.types';
import { UserType } from 'src/user/enums/user-type.enum';
import { add } from 'date-fns';
import { MagicLinkType } from './enums/magic-link.enum';
import { hash as bcryptHash, compare } from 'bcrypt';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AuthConfig,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async generateTokens(
    userId: string,
    userType: UserType,
  ): Promise<{
    sessionToken: string;
    refreshToken: string;
  }> {
    const sessionToken = this.generateSessionToken(userId, userType);
    const refreshToken = await this.generateRefreshToken(userId);
    return { sessionToken, refreshToken };
  }

  generateSessionToken(userId: string, userType: UserType): string {
    return this.jwtService.sign(
      {
        userId,
        tokenType: TokenType.Session,
        userType,
      },
      { expiresIn: '1h' },
    );
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const createdToken = await this.tokenModel.create({
      user: userId,
      revokeDate: add(new Date(), {
        minutes: this.config.getRefreshTokenExpirationTime(),
      }),
      tokenType: TokenType.Refresh,
    });
    return this.jwtService.sign(
      {
        userId,
        tokenType: TokenType.Refresh,
        requestId: createdToken._id,
      },
      { expiresIn: `${this.config.getRefreshTokenExpirationTime()}m` },
    );
  }

  async generateMagicLinkToken(
    email: string,
    type: MagicLinkType,
    redirection: string,
  ): Promise<{tokenDocument: TokenDocument, token: string}> {
    const token = this.jwtService.sign(
      {
        email,
        magicType: type,
        tokenType: TokenType.MagicLink,
        redirection,
      },
      { expiresIn: '1h', secret: this.config.getMagicLinkSecret() },
    );

    var dn = new Date();
    dn.setHours(dn.getHours() + 1);
    const tokenModel = await this.tokenModel.create({
      hash: await bcryptHash(token, this.config.getSaltRounds()),
      tokenType: TokenType.MagicLink,
      revokeDate: dn
    })
    return {tokenDocument: tokenModel, token};
  }

  async invalidateToken(id: string) {
    return this.tokenModel.findByIdAndUpdate(id, {usedAt: new Date()}, {new:true})
  }

  async findById(requestId: string): Promise<TokenDocument> {
    const token = await this.tokenModel.findById(requestId);
    if (!token) {
      throw new Error('Token not found');
    }
    return token;
  }

  async deleteById(id: string): Promise<void> {
    await this.tokenModel.deleteOne({ _id: id });
  }

  async deleteUserTokens(userId: string): Promise<void> {
    await this.tokenModel.deleteMany({ user: userId });
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    await this.tokenModel.deleteMany({
      user: userId,
      tokenType: TokenType.Refresh,
    });
  }
}
