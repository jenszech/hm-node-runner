'use strict';
import { exportValues } from './influx/InfluxExporter';
import { getCurrentStates, getDeviceList } from './ccu/ccuApi';
import { Status } from './healthcheck/Status';

import pJson from '../package.json';
import { logger } from './logger';

const config = require('config');
const myConfig = config.get('hm-node-runner');

// Starting the app
logger.info(pJson.name + ' ' + pJson.version + ' (' + myConfig.mainSetting.env + ')');
const status = new Status();

// Start Express App and interface
import { initStatusApp } from './healthcheck';
initStatusApp(status);

// At first collect all devices and delay state polling
logger.info('Collect DeviceList from CCU');
getDeviceList();
setTimeout(startPollingIntervall, 5000);

logger.info('Startup finished');

// -----------------------------------------------------------------------------
function startPollingIntervall() {
  logger.info('Start intervall polling of current values');
  updateCurrentStates();
  setInterval(() => updateCurrentStates(), myConfig.CCU.pollingIntervall * 1000);
}

function updateCurrentStates() {
  logger.debug('start updating current states');
  getCurrentStates().then((devMgr) => {
    status.lastDeviceUpdateTime = new Date();
    status.deviceCount = devMgr.mapCount();
    logger.info('... Current devices: ' + devMgr.mapCount());
    exportValues(devMgr);
  });
}
// -----------------------------------------------------------------------------
