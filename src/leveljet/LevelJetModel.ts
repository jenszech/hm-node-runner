'use strict';

export class LevelData {
  constructor(data: any) {
    if (data === null) return;
    this.update(data);
  }

  public device = 0;
  public distanz = 0;
  public fheight = 0;
  public fvol = 0;
  public pct = 0;
  public crc = 0;
  public lastUpdateTime: Date = new Date();

  public update(data: Buffer | LevelData) {
    if (Buffer.isBuffer(data)) {
      this.updateByBuffer(data);
    } else {
      this.copy(data);
    }
    this.lastUpdateTime = new Date();
  }

  private updateByBuffer(data: Buffer) {
    this.device = data[1] * 256 + data[0];
    this.distanz = data[3] * 256 + data[2];
    this.fheight = data[5] * 256 + data[4];
    this.fvol = 10 * (data[7] * 256 + data[6]);
    this.pct = data[8];
    this.crc = data[11] * 256 + data[10];
  }

  public copy(data: LevelData) {
    this.device = data.device;
    this.distanz = data.distanz;
    this.fheight = data.fheight;
    this.fvol = data.fvol;
    this.pct = data.pct;
    this.crc = data.crc;
    this.lastUpdateTime = data.lastUpdateTime;
  }

  public toString() {
    return (
      '' +
      this.device +
      ',' +
      this.pct +
      ',' +
      this.distanz +
      ',' +
      this.fheight +
      ',' +
      this.fvol +
      ',' +
      this.crc
    );
  }

  public toLogString() {
    return (
      '' + this.getNiceLastUpdatedTime() + ',' + this.pct + ',' + this.distanz + ',' + this.fheight
    );
  }

  private getNiceLastUpdatedTime(): string {
    const optDate: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const optTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return (
      this.lastUpdateTime.toLocaleDateString('de-DE', optDate) +
      ',' +
      this.lastUpdateTime.toLocaleTimeString('de-DE', optTime)
    );
  }
}
