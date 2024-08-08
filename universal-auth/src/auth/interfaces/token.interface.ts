import { TokenType } from "../types/tokens.types";

export interface ITokenPayload {
  email: string;
  tokenType: TokenType;
  iat: number;
  exp: number;
}

export interface AuthTokenPair {
  sessionToken: string;
  refreshToken: string;
}
