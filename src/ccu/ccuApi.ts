import { XmlApi, DeviceManager } from 'homematic-js-xmlapi';

import { logger } from '../logger';

const config = require('config');
const myConfig = config.get('hm-node-runner');

const devMgr = new DeviceManager();
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
