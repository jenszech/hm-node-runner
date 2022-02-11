import { getCurrentStates, getDeviceList, getCurrentVariables } from '../utils/ccuApi';
import { logger } from '../logger';
import { exportValues } from '../utils/InfluxExporter';
import { Status } from '../routes/healthcheck/Status';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export class CcuWorker {
  private status: Status;

  constructor(status: Status) {
    this.status = status;
  }

  public init() {
    logger.info('Collect DeviceList from CCU');
    // At first collect all devices and delay state polling
    getDeviceList();
    getCurrentVariables().then((sysMgr) => {
      this.status.variableStats = sysMgr.getStatistic();
    });
  }

  public startPolling() {
    this.updateCurrentStates();
    setInterval(() => this.updateCurrentStates(), myConfig.CCU.pollingIntervall * 1000);
  }

  // -- private functions ----------------------------------------------
  private updateCurrentStates() {
    logger.debug('start updating ccu values');
    getCurrentStates().then((devMgr) => {
      this.status.deviceStats = devMgr.getStatistic();
      logger.debug('... Current devices: ' + this.status.deviceStats.deviceCount);
      exportValues(devMgr);
    });
  }
}
