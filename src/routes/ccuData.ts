// define a route handler for the default home page
import * as core from 'express-serve-static-core';
import { getSysMgr } from '../utils/ccuApi';

export function defineExpressRouteCCUData(expressApp: core.Express) {
  // define a route handler for the default home page
  expressApp.get('/data', (req, res) => {
    res.send(getJson());
  });
}

function getJson(): object {
  const variable = [];
  const obj = getSysMgr().getVariablesRaw();
  for (const sysVar of obj.values()) {
    variable.push(sysVar);
  }
  return variable;
}
