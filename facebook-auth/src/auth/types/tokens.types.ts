
export enum TokenType {
  AccountConfirmation = 'account_confirmation',
  Session = 'session',
  ResetPassword = 'reset_password',
  Refresh = 'refresh',
  UpdateEmail = 'update_email',
}

export type TokenPayload = {
  userId: string;
  requestId: string;
  tokenType: TokenType;
};

export type SessionTokenPayload = {
  userId: string;
};

export type EmailChangeTokenPayload = {
  newEmail: string;
  userId: string;
};
