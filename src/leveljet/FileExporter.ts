import { logger } from '../logger';
import fs from 'fs';
import { LevelData } from './LevelJetModel';

export enum ExportInterval {
  every_second = 1,
  every_minute,
  hourly,
  daily
}

export class FileExporter {
  public file = '';
  public exportInterval  = ExportInterval.every_minute;
  private exportedLevel: LevelData = new LevelData(null);

  constructor(logFile: string) {
    this.file = logFile;
  }

  public exportLevel(level: LevelData) {
    if (FileExporter.isTimeToExport(level, this.exportedLevel, this.exportInterval)) {
      this.exportedLevel.copy(level);
      this.writeLog(this.exportedLevel.toLogString());
      logger.info('Exported');
    }
  }

  private writeLog(data: string) {
    try {
      fs.appendFileSync(this.file, data+'\n');
    } catch(err) {
      logger.error('Fehler beim Dateischreiben: ', err);
    }
  }

  public static isTimeToExport(lvl1: LevelData,
                               lvl2: LevelData,
                               interval: ExportInterval) : boolean {
    switch (interval) {
      case ExportInterval.every_second:
        // tslint:disable-next-line:triple-equals
        return (lvl1.lastUpdateTime.getSeconds() !==
          lvl2.lastUpdateTime.getSeconds());
      case ExportInterval.every_minute:
        return (lvl1.lastUpdateTime.getMinutes() !==
          lvl2.lastUpdateTime.getMinutes());
      case ExportInterval.hourly:
        return (lvl1.lastUpdateTime.getHours() !==
          lvl2.lastUpdateTime.getHours());
      case ExportInterval.daily:
        return (lvl1.lastUpdateTime.getDay() !==
          lvl2.lastUpdateTime.getDay());
    }
    return false;
  }
}