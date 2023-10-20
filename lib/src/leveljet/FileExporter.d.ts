import { LevelData } from './LevelJetModel';
export declare enum ExportInterval {
  every_second = 1,
  every_minute = 2,
  hourly = 3,
  daily = 4,
}
export declare class FileExporter {
  file: string;
  exportInterval: ExportInterval;
  private exportedLevel;
  constructor(logFile: string);
  exportLevel(level: LevelData): void;
  private writeLog;
  static isTimeToExport(lvl1: LevelData, lvl2: LevelData, interval: ExportInterval): boolean;
}
