// define a route handler for the default home page
import * as core from 'express-serve-static-core';
import { logger } from '../logger';
import { query, QueryOptions } from 'winston';

export function defineExpressRouteLogging(expressApp: core.Express) {
  // define a route handler for the default home page
  expressApp.get('/api/time', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(getTime());
  });
}


function getTime(): object {
  const today = new Date();
  const now = today.toTimeString().substring(0,8); //chop off the timezone information
  const result = {
    time: now
  };
  logger.info(`Time requested at ${now}`);
  return result;
}
