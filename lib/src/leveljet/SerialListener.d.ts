import { LevelData } from './LevelJetModel';
declare type serialEventHandler = (level: LevelData) => void;
export declare class SerialListener {
    private serialInterface;
    private port;
    private parser;
    private countFailure;
    private countSuccess;
    level: LevelData;
    levelUpdateCallback: serialEventHandler;
    constructor(serialInterface: string, callback: serialEventHandler);
    startListener(): void;
    stopListener(): void;
    private initiatePort;
    private calcCheckSum;
    private isValidDataPackage;
    private parseSerialDataBuffer;
    private resetCounter;
    calcErrorRate(): number;
}
export {};
