import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthConfig } from 'src/config/auth.config';
import { hash as bcryptHash } from 'bcrypt';

import { TokenType } from './types/tokens.types';
import { add } from 'date-fns';
import { Token, TokenDocument } from './schemas/token.schema';
import { UserType } from 'src/user/enums/user-type.enum';

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

  async generatePasswordResetToken(userId: string): Promise<{token: string, id: string}> {
    const token = this.jwtService.sign(
      {
        userId,
        tokenType: TokenType.ResetPassword,
      },
      { expiresIn: '10m' },
    );
    const createdToken = await this.tokenModel.create({
      user: userId,
      revokeDate: add(new Date(), {
        minutes: 10,
      }),
      hash: await bcryptHash(token, this.config.getSaltRounds()),
      tokenType: TokenType.ResetPassword,
    });
    
    return { token, id: createdToken._id.toString() };
  }

  async generateVerifyAccountToken(userId: string): Promise<{token: string, id: string}> {
    const token = this.jwtService.sign(
      {
        userId,
        tokenType: TokenType.AccountConfirmation,
      },
      { expiresIn: '10m' },
    );
    const createdToken = await this.tokenModel.create({
      user: userId,
      revokeDate: add(new Date(), {
        minutes: 10,
      }),
      hash: await bcryptHash(token, this.config.getSaltRounds()),
      tokenType: TokenType.AccountConfirmation,
    });
    
    return { token, id: createdToken._id.toString() };
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
  
  async invalidateToken(tokenId: string): Promise<void> {
    await this.tokenModel.updateOne({ _id: tokenId }, { usedAt: new Date() });
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
