import { MS1_HELLO_WORLD } from './interfaces/ms1.interface';
import { QUEUES } from './queues';

export const REDIRECTION_RULES = {
  //[ADMIN_USER_REGISTERED]: {
  //  queues: [QUEUES.ADMIN_IN],
  //},
  [MS1_HELLO_WORLD]: {
    queues: [QUEUES.MS1_IN, QUEUES.MS2_IN]
  }
};
