import { getSysMgr, setValueToSysVar } from '../utils/ccuApi';
import { logger } from '../logger';
import { exportVariable, getMeasureFromConfig } from '../utils/InfluxExporter';
import { Status } from '../routes/healthcheck/Status';
import { LevelData } from '../leveljet/LevelJetModel';
import { LevelJetConnector } from '../leveljet/leveljetConnector';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export class LeveljetWorker {
  private status: Status;
  private levelCon: LevelJetConnector | null;

  constructor(status: Status) {
    this.status = status;
    this.levelCon = null;
    if (myConfig.jobs.LevelJetImport.enable === false) return;
    this.levelCon = new LevelJetConnector(myConfig.jobs.LevelJetImport.serialInterface);
  }

  public init() {
    if (this.levelCon === null) return;
    this.levelCon.setLevelUpdateCallback(this.levelUpdate.bind(this));
  }

  public startPolling() {
    if (this.levelCon === null) return;
    const conf = myConfig.jobs.LevelJetImport;
    this.levelCon.setExport(conf.enableFileExport, conf.exportFile, conf.exportIntervall);
  }

  // -- private functions ----------------------------------------------

  private levelUpdate(level: LevelData) {
    const sysVar = getSysMgr().getVariableByName(myConfig.jobs.LevelJetImport.name);
    const measure = getMeasureFromConfig(myConfig.jobs.LevelJetImport.name);
    setValueToSysVar(sysVar, level.fheight);
    if (measure) {
      exportVariable(measure, sysVar);
    } else {
      logger.warn('NOT Found ---> ' + myConfig.jobs.LevelJetImport.name);
    }
  }
}
