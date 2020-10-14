import express from 'express';
import { logger } from '../logger';
import { Status } from './Status';
import * as core from 'express-serve-static-core';

let status2: Status = new Status();

export function initStatusApp(status: Status, statusApp: core.Express) {
  status2 = status;

  logger.info('Initialise http listening');

  // define a route handler for the default home page
  statusApp.get('/', (req, res) => {
    res.send(status2.getJson());
  });
}
