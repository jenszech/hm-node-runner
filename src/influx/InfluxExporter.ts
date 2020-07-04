import { DeviceManager, DataType, ValueType, Channel, DataPoint } from 'homematic-js-xmlapi';
import { postToInflux } from './InfluxConnector';

import { logger } from '../logger';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export function exportValues(devMgr: DeviceManager) {
  if (myConfig.has('exportValues')) {
    exportAllValuesFromConfig(devMgr);
  }
}

function exportAllValuesFromConfig(devMgr: DeviceManager) {
  for (const measure of myConfig.exportValues) {
    const channel = devMgr.getChannelByName(measure.name);
    if (channel) {
      export2InfluxByType(channel, getType(measure.data), measure);
    } else {
      logger.warn('NOT Found ---> ' + measure.name);
    }
  }
}

function export2InfluxByType(channel: Channel, type: number, measure: any) {
  const dataPoint = getDataPoint(channel, type);
  if (dataPoint) {
    if (dataPoint?.valueType === ValueType.Number) {
      const value = dataPoint.value as number;
      postToInflux(measure.dataName, measure.area, channel?.name, value);
    } else if (dataPoint?.valueType === ValueType.Bool) {
      const value = (dataPoint.value as boolean) ? 1 : 0;
      postToInflux(measure.dataName, measure.area, channel?.name, value);
    } else if (dataPoint?.valueType === ValueType.List) {
      const value = dataPoint.value as number;
      postToInflux(measure.dataName, measure.area, channel?.name, value);
    } else {
      logger.warn(
        'NOT a number ---> ' +
          measure.name +
          ' : ' +
          channel.dataPoint?.get(type)?.value +
          ' (' +
          channel.dataPoint?.get(type)?.valueType +
          ')',
      );
    }
  } else {
    logger.warn('Datapoint undefined ---> ' +
      measure.name + ' : ' + channel.name + ' (' + measure.data + ')');
  }
}

function getType(typeStr: any) {
  return parseInt(DataType[typeStr], 10);
}

function getDataPoint(channel: Channel, type: number): DataPoint | undefined {
  if (channel.dataPoint) {
    return channel.dataPoint.get(type);
  }
  return undefined;
}
