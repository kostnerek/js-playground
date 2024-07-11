export enum QUEUES {
  MS1_IN = 'MS1_IN',
  MS1_OUT= 'MS1_OUT',
  MS2_IN = 'MS2_IN',
  MS2_OUT= 'MS2_OUT',
}

export enum ORCHESTRATOR_QUEUES {
  ORCHESTRATOR_IN = 'ORCHESTRATOR_IN',
  ORCHESTRATOR_OUT = 'ORCHESTRATOR_OUT',
}

export const outQueues = <OutQueue[]>(
  Object.values(QUEUES).filter((queue) => queue.endsWith('_OUT'))
);

export const inQueues = <InQueue[]>(
  Object.values(QUEUES).filter((queue) => queue.endsWith('_IN'))
);

export const allQueues = <QUEUES[]>Object.values(QUEUES);

export type OutQueue = Extract<QUEUES, `${string}_OUT${'_GLOBAL' | ''}`>;
export type InQueue = Extract<QUEUES, `${string}_IN${'_GLOBAL' | ''}`>;
