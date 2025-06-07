import { Status } from '../routes/healthcheck/Status';
export declare class LeveljetWorker {
    private status;
    private levelCon;
    constructor(status: Status);
    init(): void;
    startPolling(): void;
    private levelUpdate;
}
