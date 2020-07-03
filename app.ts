'use strict'
import { exportValues } from './src/InfluxExporter';
import { getCurrentStates, getDeviceList } from './src/ccuApi';

import pJson from './package.json';
import { logger } from './src/logger';
// import * as config from "config";
const config = require('config');
const myConfig = config.get('hm-node-runner');

logger.info(pJson.name + ' ' + pJson.version + ' (' + myConfig.mainSetting.env + ')');

logger.info('Collect DeviceList from CCU');
getDeviceList();
setTimeout(startPollingIntervall, 5000);

function startPollingIntervall() {
  logger.info('Start intervall polling of current values');
  updateCurrentStates();
  setInterval(() => updateCurrentStates(), myConfig.CCU.pollingIntervall*1000);
}

function updateCurrentStates() {
  logger.debug('start updating current states');
  getCurrentStates().then((devMgr) => {
    logger.info('... Current devices: ' + devMgr.mapCount());
    exportValues(devMgr);
  });
}

logger.info('Startup finished');
