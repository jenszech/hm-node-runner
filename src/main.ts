'use strict';
import pJson from '../package.json';
import { logger } from './logger';
const config = require('config');
const myConfig = config.get('hm-node-runner');
logger.info('Configuration directory: ' + config.util.getEnv('NODE_CONFIG_DIR'));
logger.info(pJson.name + ' ' + pJson.version + ' (' + myConfig.mainSetting.env + ')');

import express from 'express';
import { defineExpressRouteStatus } from './routes/healthcheck';
import { defineExpressRouteCCUData } from './routes/ccuData';
import { defineExpressRouteLogging } from './routes/logData';
import { Status } from './routes/healthcheck/Status';
import { CcuWorker } from './jobs/ccuWorker';
import { Km200Worker } from './jobs/km200Worker';
import { LeveljetWorker } from './jobs/leveljetWorker';

// Starting the app
const status = new Status();

// Start Express App and interface
const expressApp = express();
defineExpressRouteLogging(expressApp);
defineExpressRouteStatus(status, expressApp);
defineExpressRouteCCUData(expressApp);


// start the Express server
expressApp.listen(myConfig.healthcheck.port, () => {
  logger.info(`Server started at http://localhost:${myConfig.healthcheck.port}`);
});

// -- Initiliase ---------------------------------------

const ccuWorker = new CcuWorker(status);
ccuWorker.init();

const km200Worker = new Km200Worker(status);
km200Worker.init();

const leveljetWorker = new LeveljetWorker(status);
leveljetWorker.init();

// Init Polling
setTimeout(startPollingIntervall, 5000);
logger.info('Startup finished');

// -- Init Handler -----------------------------------------------------------------
function startPollingIntervall() {
  logger.info('Start intervall polling of current values');
  ccuWorker.startPolling();
  km200Worker.startPolling();
  leveljetWorker.startPolling();
}
// -----------------------------------------------------------------------------
