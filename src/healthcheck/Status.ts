'use strict';
import { DeviceStatistic } from 'homematic-js-xmlapi'

export class Status {
  public serviceStart: Date = new Date();
  public deviceStats: DeviceStatistic = new DeviceStatistic();

  public getJson(): object {
    return {
      health: 'OK',
      StartTime: this.serviceStart,
      Device: {
        LastUpdate: {
          Updated: this.deviceStats.lastUpdateCount,
          Timestamp: this.deviceStats.lastUpdateTime,
        },
        Devices: this.deviceStats.deviceCount,
        Channels: this.deviceStats.channelCount,
        DataPoints: this.deviceStats.datapointCount,
      },
    };
  }
}
