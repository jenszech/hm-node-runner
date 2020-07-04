import express from 'express';
import { logger } from '../logger';
import { Status } from './Status';

const config = require('config');
const myConfig = config.get('hm-node-runner');
let status2: Status = new Status();

export function initStatusApp(status: Status) {
  const statusApp = express();
  const port = myConfig.healthcheck.port;
  status2 = status;

  logger.info('Initialise http listening');

  // define a route handler for the default home page
  statusApp.get('/', (req, res) => {
    res.send(status2.getJson());
  });

  // start the Express server
  statusApp.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
  });
}
