import { setValuesList, getSysMgr } from '../utils/ccuApi';
import { logger } from '../logger';
import { exportAllVariables } from '../utils/InfluxExporter';
import { Status } from '../routes/healthcheck/Status';
import { getKm200Values, km200Statistic } from '../utils/km200api';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export class Km200Worker {
  private status: Status;

  constructor(status: Status) {
    this.status = status;
  }

  public init() {
    this.importKm200Values();
  }

  public startPolling() {
    setInterval(() => this.importKm200Values(), myConfig.jobs.km200Import.pollingIntervall * 1000);
  }

  // -- private functions ----------------------------------------------

  // KM200 Import and export to homematic
  private importKm200Values() {
    logger.debug('start updating km200 values');
    getKm200Values()
      .then((valueMap) => {
        setValuesList(valueMap);
        logger.debug('... Current KM200 Values: ' + km200Statistic.variableCount);
        exportAllVariables(getSysMgr());
      })
      .catch((error) => {
        logger.error('ERROR:', error);
      });
  }
}
