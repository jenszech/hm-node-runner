// define a route handler for the default home page
import * as core from 'express-serve-static-core';
import { getSysMgr, getDevMgr } from '../utils/ccuApi';

export function defineExpressRouteCCUData(expressApp: core.Express) {
  // define a route handler for the default home page
  expressApp.get('/data/variable', (req, res) => {
    res.send(getSysJson());
  });
  expressApp.get('/data/device', (req, res) => {
    res.send(getDeviceJson());
  });
}

function getSysJson(): object {
  const variable = [];
  const obj = getSysMgr().getVariablesRaw();
  for (const sysVar of obj.values()) {
    variable.push(sysVar);
  }
  return variable;
}

function getDeviceJson(): object {
  const variable = [];
  const obj = getDevMgr().getDevicesRaw();
  for (const devVar of obj.values()) {
    variable.push(devVar);
  }
  return variable;
}
