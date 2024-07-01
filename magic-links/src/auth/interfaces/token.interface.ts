import { MagicLinkType } from '../enums/magic-link.enum';
import { TokenType } from '../types/tokens.types';

export interface ITokenPayload {
  email: string;
  magicType?: MagicLinkType;
  tokenType: TokenType;
  redirection?: string;
  iat: number;
  exp: number;
}
