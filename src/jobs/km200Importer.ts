import { Km200 } from 'km200-api';

import { logger } from '../logger';
import { DeviceManager } from 'homematic-js-xmlapi';

const config = require('config');
const myConfig = config.get('hm-node-runner');

const km200Importer = new Km200(
  myConfig.jobs.km200Import.host,
  myConfig.jobs.km200Import.port,
  myConfig.jobs.km200Import.key,
);

export const km200Statistic = {
  lastUpdateCount: 0,
  lastUpdateTime: new Date(),
  variableCount: 0,
};

export async function getKm200Value(api: string): Promise<number | string | boolean> {
  return importValue(api);
}

export function getKm200Values(): Promise<Map<string, number | boolean>> {
  if (myConfig.jobs.influxExport.has('exportValues')) {
    return importAllValuesFromConfig();
  }
  return Promise.reject();
}

async function importAllValuesFromConfig(): Promise<Map<string, number | boolean>> {
  const valueMap = new Map<string, number | boolean>();
  let count = 0;
  for (const measure of myConfig.jobs.km200Import.importValues) {
    const value = await importValue(measure.api);
    valueMap.set(measure.name, value);
    count++;
  }
  km200Statistic.lastUpdateCount = count;
  km200Statistic.lastUpdateTime = new Date();
  km200Statistic.variableCount = valueMap.size;
  return valueMap;
}

function importValue(api: string): Promise<any> {
  return km200Importer
    .getKM200(api)
    .then((data) => {
      return convertData(data.value, data.type);
    })
    .catch((error) => {
      logger.error('ERROR:', error);
      return Promise.reject();
    });
}

function convertData(data: string, type: string): number | string | boolean | null {
  switch (type) {
    case 'floatValue':
      return parseFloat(data);
      break;
    case 'stringValue':
      if (data === 'on' || data === 'off') return data === 'on';
      return data;
      break;
  }
  return null;
}
