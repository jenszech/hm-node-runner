import { ExportInterval, FileExporter } from './FileExporter';
import { SerialListener } from './SerialListener';
import { LevelData } from './LevelJetModel';
import { logger } from '../logger';

declare type levelUpdateHandler = (level: LevelData) => void;

export const levelJetStatistic = {
  lastUpdateTime: new Date(),
  lastChangeTime: new Date(),
  fuel: 0,
  failureRate: 0,
};

export class LevelJetConnector {
  private fileExporter: FileExporter;
  private serial: SerialListener;
  private levelUpdateCallback: levelUpdateHandler | null = null;
  private enableFileExport: boolean = false;
  public level: LevelData = new LevelData(null);

  constructor(serialInterface: string) {
    this.fileExporter = new FileExporter('LevelExport.csv');
    this.serial = new SerialListener(serialInterface, this.levelUpdateHandler.bind(this));
    this.serial.startListener();
  }

  public setLevelUpdateCallback(callback: levelUpdateHandler) {
    this.levelUpdateCallback = callback;
  }
  public setExport(enableExport: boolean, filePath?: string, interval?: string) {
    if (filePath) {
      this.fileExporter.file = filePath;
    }
    if (interval) {
      this.fileExporter.exportInterval = (ExportInterval as any)[interval];
    }
    this.enableFileExport = enableExport;
  }

  private levelUpdateHandler(level: LevelData) {
    if (this.enableFileExport) {
      this.fileExporter.exportLevel(level);
    }
    if (this.levelUpdateCallback) {
      if (
        FileExporter.isTimeToExport(level, this.level, ExportInterval.every_minute) ||
        level.distanz !== this.level.distanz
      ) {
        this.levelUpdateCallback(level);
        levelJetStatistic.lastChangeTime = new Date();
      }
    }
    this.level.copy(level);
    levelJetStatistic.fuel = this.level.fheight;
    levelJetStatistic.lastUpdateTime = this.level.lastUpdateTime;
    levelJetStatistic.failureRate = this.serial.calcErrorRate();
  }
}

export { ExportInterval } from './FileExporter';
export { LevelData } from './LevelJetModel';
