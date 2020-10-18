import { XmlApi, DeviceManager, SystemVariableManager, SystemVariable } from 'homematic-js-xmlapi';
import { logger } from '../logger';
import { Status } from '../healthcheck/Status';
import * as core from 'express-serve-static-core';

const config = require('config');
const myConfig = config.get('hm-node-runner');

const devMgr = new DeviceManager();
const sysMgr = new SystemVariableManager();
const xmlApi = new XmlApi(myConfig.CCU.host, myConfig.CCU.port);

// define a route handler for the default home page
export function initCcuApi(expressApp: core.Express) {
  // define a route handler for the default home page
  expressApp.get('/data', (req, res) => {
    res.send(getJson());
  });
}

export function getSysMgr(): SystemVariableManager {
  return sysMgr;
}

function getJson(): object {
  const variable = [];
  const obj = sysMgr.getVariablesRaw();
  for (const sysVar of obj.values()) {
    variable.push(sysVar);
  }
  return variable;
}

export function getDeviceList() {
  xmlApi
    .getDeviceList()
    .then((deviceList) => {
      if (deviceList) devMgr.updateDeviceList(deviceList);
    })
    .catch((error) => {
      logger.error('ERROR:', error);
    });
}
export function getCurrentVariables(): Promise<SystemVariableManager> {
  return xmlApi
    .getSysVarList()
    .then((sysList) => {
      if (sysList) sysMgr.updateSysVarList(sysList);
      return sysMgr;
    })
    .catch((error) => {
      logger.error('ERROR:', error);
      return Promise.reject();
    });
}

export function getCurrentStates(): Promise<DeviceManager> {
  return xmlApi
    .getStateList()
    .then((deviceList) => {
      if (deviceList) devMgr.updateDeviceList(deviceList);
      return devMgr;
    })
    .catch((error) => {
      logger.error('ERROR:', error);
      return Promise.reject();
    });
}

export function setValuesList(valueMap: Map<string, number | boolean>) {
  for (const value of valueMap.entries()) {
    setValue(value[0], value[1]);
  }
}

export function setValue(valuename: string, value: number | boolean) {
  const sysvar = sysMgr.getVariableByName(valuename);
  if (sysvar) {
    setValueToCCU(sysvar.iseId, value);
  }
}

function setValueToCCU(id: string, value: number | boolean) {
  xmlApi.setState(id, convertValue(value)).catch((error) => {
    logger.error('ERROR:', error);
  });
}

function convertValue(value: number | boolean): number {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  } else {
    return value;
  }
}
