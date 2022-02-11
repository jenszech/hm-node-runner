import { LevelData } from './LevelJetModel';
declare type levelUpdateHandler = (level: LevelData) => void;
export declare const levelJetStatistic: {
    lastUpdateTime: Date;
    lastChangeTime: Date;
    fuel: number;
    failureRate: number;
};
export declare class LevelJetConnector {
    private fileExporter;
    private serial;
    private levelUpdateCallback;
    private enableFileExport;
    level: LevelData;
    constructor(serialInterface: string);
    setLevelUpdateCallback(callback: levelUpdateHandler): void;
    setExport(enableExport: boolean, filePath?: string, interval?: string): void;
    private levelUpdateHandler;
}
export { ExportInterval } from './FileExporter';
export { LevelData } from './LevelJetModel';
