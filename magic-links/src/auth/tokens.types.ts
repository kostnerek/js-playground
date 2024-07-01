import { UserType } from 'src/user/enums/user-type.enum';

export enum TokenType {
  AccountConfirmation = 'account_confirmation',
  Session = 'session',
  ResetPassword = 'reset_password',
  Refresh = 'refresh',
  UpdateEmail = 'update_email',
  MagicLink = 'magic_link',
}

export type TokenPayload = {
  userId: string;
  requestId: string;
  tokenType: TokenType;
};

export type SessionTokenPayload = {
  userId: string;
  userType: UserType;
};

export type EmailChangeTokenPayload = {
  newEmail: string;
  userId: string;
};
