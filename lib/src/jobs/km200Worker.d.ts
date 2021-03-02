import { Status } from '../routes/healthcheck/Status';
export declare class Km200Worker {
  private status;
  constructor(status: Status);
  init(): void;
  startPolling(): void;
  private importKm200Values;
}
