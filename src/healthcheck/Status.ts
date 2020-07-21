'use strict';
import { DeviceStatistic, VariableStatistic } from 'homematic-js-xmlapi';
import { km200Statistic } from '../jobs/km200Importer';
import pJson from '../../package.json';
const config = require('config');
const myConfig = config.get('hm-node-runner');

export class Status {
  public serviceStart: Date = new Date();
  public deviceStats: DeviceStatistic = new DeviceStatistic();
  public variableStats: VariableStatistic = new VariableStatistic();

  public getJson(): object {
    return {
      health: 'OK',
      StartTime: this.serviceStart,
      version: pJson.version + ' (' + myConfig.mainSetting.env + ')',
      CCU: {
        Device: {
          LastUpdate: {
            Updated: this.deviceStats.lastUpdateCount,
            Timestamp: this.deviceStats.lastUpdateTime,
          },
          Devices: this.deviceStats.deviceCount,
          Channels: this.deviceStats.channelCount,
          DataPoints: this.deviceStats.datapointCount,
        },
        Variable: {
          LastUpdate: {
            Updated: this.variableStats.lastUpdateCount,
            Timestamp: this.variableStats.lastUpdateTime,
          },
          Variables: this.variableStats.variableCount,
        },
      },
      KM200: {
        LastUpdate: {
          Updated: km200Statistic.lastUpdateCount,
          Timestamp: km200Statistic.lastUpdateTime,
        },
        Variables: km200Statistic.variableCount,
      },
    };
  }
}
