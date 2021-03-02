'use strict';
import { DeviceStatistic, VariableStatistic } from 'homematic-js-xmlapi';
import { km200Statistic } from '../../utils/km200api';
import pJson from '../../../package.json';
import { levelJetStatistic } from '../../leveljet/leveljetConnector';
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
        Host: myConfig.CCU.host,
        PollingIntervall: myConfig.CCU.pollingIntervall,
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
        Host: myConfig.jobs.km200Import.host,
        PollingIntervall: myConfig.jobs.km200Import.pollingIntervall,
        LastUpdate: {
          Updated: km200Statistic.lastUpdateCount,
          Timestamp: km200Statistic.lastUpdateTime,
        },
        Variables: km200Statistic.variableCount,
      },
      LevelJet: {
        Interface: myConfig.jobs.LevelJetImport.serialInterface,
        Export: {
          Enabled: myConfig.jobs.LevelJetImport.enableFileExport,
          File: myConfig.jobs.LevelJetImport.exportFile,
          Interval: myConfig.jobs.LevelJetImport.exportIntervall,
        },
        LastUpdate: {
          Updated: levelJetStatistic.lastUpdateTime,
          Changed: levelJetStatistic.lastChangeTime,
          Failure: levelJetStatistic.failureRate,
          Fuel: levelJetStatistic.fuel,
        },
      },
    };
  }
}
