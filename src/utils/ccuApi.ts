import { XmlApi, DeviceManager, SystemVariableManager } from 'homematic-js-xmlapi';
import { logger } from '../logger';

const config = require('config');
const myConfig = config.get('hm-node-runner');

const devMgr = new DeviceManager();
const sysMgr = new SystemVariableManager();
const xmlApi = new XmlApi(myConfig.CCU.host, myConfig.CCU.port);

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
    const sysvar = sysMgr.getVariableByName(value[0]);
    if (sysvar) {
      setValue(sysvar.iseId, value[1]);
    }
  }
}

function setValue(id: string, value: number | boolean) {
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
