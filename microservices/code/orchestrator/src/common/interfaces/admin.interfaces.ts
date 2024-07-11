import { QueueMessage } from './queueMessage.interface';

export const ADMIN_USER_REGISTERED = 'ADMIN_USER_REGISTERED';
export interface AdminUserRegisteredMessage extends QueueMessage {
  messageName: typeof ADMIN_USER_REGISTERED;
  messagePayload: {
    id: string;
    email: string;
    password: string;
  };
}
