import { Status } from '../routes/healthcheck/Status';
export declare class CcuWorker {
  private status;
  constructor(status: Status);
  init(): void;
  startPolling(): void;
  private updateCurrentStates;
}
