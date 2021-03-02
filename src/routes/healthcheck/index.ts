import express from 'express';
import { logger } from '../../logger';
import { Status } from './Status';
import * as core from 'express-serve-static-core';

let statusValue: Status = new Status();

export function defineExpressRouteStatus(status: Status, statusApp: core.Express) {
  statusValue = status;
  logger.info('Initialise http listening');

  // define a route handler for the default home page
  statusApp.get('/', (req, res) => {
    res.send(statusValue.getJson());
  });
}
