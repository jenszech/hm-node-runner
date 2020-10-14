'use strict';
import { exportValues, exportVariables } from './jobs/InfluxExporter';
import {
  getCurrentStates,
  getDeviceList,
  getCurrentVariables,
  setValuesList, initCcuApi, getSysMgr
} from './utils/ccuApi';
import { getKm200Values, km200Statistic } from './jobs/km200Importer';
import { Status } from './healthcheck/Status';

import pJson from '../package.json';
import { logger } from './logger';
import express from 'express';
import { initStatusApp } from './healthcheck';

const config = require('config');
const myConfig = config.get('hm-node-runner');

// Starting the app
logger.info(pJson.name + ' ' + pJson.version + ' (' + myConfig.mainSetting.env + ')');
const status = new Status();

// Start Express App and interface
const expressApp = express();
initStatusApp(status, expressApp);
initCcuApi(expressApp);
// start the Express server
expressApp.listen(myConfig.healthcheck.port, () => {
  logger.info(`server started at http://localhost:${myConfig.healthcheck.port}`);
});

// At first collect all devices and delay state polling
logger.info('Collect DeviceList from CCU');
getDeviceList();
getCurrentVariables().then((sysMgr) => {
  status.variableStats = sysMgr.getStatistic();
});

// Start polling
setTimeout(startPollingIntervall, 5000);

importKm200Values();

logger.info('Startup finished');

// -----------------------------------------------------------------------------
function startPollingIntervall() {
  logger.info('Start intervall polling of current values');
  updateCurrentStates();
  setInterval(() => updateCurrentStates(), myConfig.CCU.pollingIntervall * 1000);
  setInterval(() => importKm200Values(), myConfig.jobs.km200Import.pollingIntervall * 1000);
}

function updateCurrentStates() {
  logger.debug('start updating current states');
  getCurrentStates().then((devMgr) => {
    status.deviceStats = devMgr.getStatistic();
    logger.debug('... Current devices: ' + status.deviceStats.deviceCount);
    exportValues(devMgr);
  });
}

function importKm200Values() {
  logger.debug('start updating km200 values');
  getKm200Values()
    .then((valueMap) => {
      setValuesList(valueMap);
      logger.debug('... Current KM200 Values: ' + km200Statistic.variableCount);
      exportVariables(getSysMgr());
    })
    .catch((error) => {
      logger.error('ERROR:', error);
    });
}

// -----------------------------------------------------------------------------
