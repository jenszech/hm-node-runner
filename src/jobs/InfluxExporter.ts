import {
  DeviceManager,
  DataType,
  ValueType,
  Channel,
  DataPoint,
  SystemVariableManager,
  SystemVariable,
} from 'homematic-js-xmlapi';
import { postToInflux } from '../utils/InfluxConnector';

import { logger } from '../logger';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export function exportValues(devMgr: DeviceManager) {
  if (myConfig.jobs.influxExport.has('exportValues')) {
    exportAllValuesFromConfig(devMgr);
  }
}

function exportAllValuesFromConfig(devMgr: DeviceManager) {
  for (const measure of myConfig.jobs.influxExport.exportValues) {
    if (measure.typ !== 'SYSVAR') {
      const channel = devMgr.getChannelByName(measure.name);
      if (channel) {
        export2InfluxByType(channel, getType(measure.data), measure);
      } else {
        logger.warn('NOT Found ---> ' + measure.name);
      }
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
    logger.warn(
      'Datapoint undefined ---> ' + measure.name + ' : ' + channel.name + ' (' + measure.data + ')',
    );
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

export function exportAllVariables(sysMgr: SystemVariableManager) {
  if (myConfig.jobs.influxExport.has('exportValues')) {
    exportAllVariablesFromConfig(sysMgr);
  }
}

export function exportMeasurement(measure: any, sysMgr: SystemVariableManager) {
  const variable = sysMgr.getVariableByName(measure.name);
  exportVariable(measure, variable);
}

export function exportVariable(measure: any, sysVar: SystemVariable | null) {
  if (sysVar) {
    // logger.info(measure.dataName + '@' + measure.area + ' -> ' + variable.value);
    exportVariable2InfluxByType(sysVar, measure.dataName, measure.area);
  } else {
    logger.warn('NOT Found ---> ' + measure.name);
  }
}

function exportAllVariablesFromConfig(sysMgr: SystemVariableManager) {
  for (const measure of myConfig.jobs.influxExport.exportValues) {
    if (measure.typ === 'SYSVAR') {
      exportMeasurement(measure, sysMgr);
    }
  }
}

function exportVariable2InfluxByType(variable: SystemVariable, name: string, area: string) {
  // logger.debug(type + '@' + area + ' -> ' + name +': ' + value);
  if (variable?.valueType === ValueType.Number) {
    const value = variable.value as number;
    postToInflux(name, area, variable?.name, value);
  } else if (variable?.valueType === ValueType.Bool) {
    const value = (variable.value as boolean) ? 1 : 0;
    postToInflux(name, area, variable?.name, value);
  } else if (variable?.valueType === ValueType.List) {
    const value = variable.value as number;
    postToInflux(name, area, variable?.name, value);
  }
}

export function getMeasureFromConfig(name: string): any {
  for (const measure of myConfig.jobs.influxExport.exportValues) {
    if (measure.name === name) {
      return measure;
    }
  }
  return null;
}
