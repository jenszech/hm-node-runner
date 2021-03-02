'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var InfluxExporter_1 = require("./jobs/InfluxExporter");
var ccuApi_1 = require("./utils/ccuApi");
var km200Importer_1 = require("./jobs/km200Importer");
var Status_1 = require("./healthcheck/Status");
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var logger_1 = require("./logger");
var express_1 = tslib_1.__importDefault(require("express"));
var healthcheck_1 = require("./healthcheck");
var leveljetConnector_1 = require("./leveljet/leveljetConnector");
var config = require('config');
var myConfig = config.get('hm-node-runner');
logger_1.logger.info(package_json_1.default.name + ' ' + package_json_1.default.version + ' (' + myConfig.mainSetting.env + ')');
var status = new Status_1.Status();
var expressApp = express_1.default();
healthcheck_1.initStatusApp(status, expressApp);
ccuApi_1.initCcuApi(expressApp);
expressApp.listen(myConfig.healthcheck.port, function () {
    logger_1.logger.info("server started at http://localhost:" + myConfig.healthcheck.port);
});
logger_1.logger.info('Collect DeviceList from CCU');
ccuApi_1.getDeviceList();
ccuApi_1.getCurrentVariables().then(function (sysMgr) {
    status.variableStats = sysMgr.getStatistic();
});
importKm200Values();
var levelJet = initLeveljet();
levelJet.setLevelUpdateCallback(levelUpdate.bind(this));
setTimeout(startPollingIntervall, 5000);
logger_1.logger.info('Startup finished');
function startPollingIntervall() {
    logger_1.logger.info('Start intervall polling of current values');
    updateCurrentStates();
    setInterval(function () { return updateCurrentStates(); }, myConfig.CCU.pollingIntervall * 1000);
    setInterval(function () { return importKm200Values(); }, myConfig.jobs.km200Import.pollingIntervall * 1000);
}
function initLeveljet() {
    var conf = myConfig.jobs.LevelJetImport;
    var levelCon = new leveljetConnector_1.LevelJetConnector(conf.serialInterface);
    levelCon.setExport(conf.enableFileExport, conf.exportFile, conf.exportIntervall);
    return levelCon;
}
function updateCurrentStates() {
    logger_1.logger.debug('start updating current states');
    ccuApi_1.getCurrentStates().then(function (devMgr) {
        status.deviceStats = devMgr.getStatistic();
        logger_1.logger.debug('... Current devices: ' + status.deviceStats.deviceCount);
        InfluxExporter_1.exportValues(devMgr);
    });
}
function importKm200Values() {
    logger_1.logger.debug('start updating km200 values');
    km200Importer_1.getKm200Values()
        .then(function (valueMap) {
        ccuApi_1.setValuesList(valueMap);
        logger_1.logger.debug('... Current KM200 Values: ' + km200Importer_1.km200Statistic.variableCount);
        InfluxExporter_1.exportAllVariables(ccuApi_1.getSysMgr());
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
    });
}
function levelUpdate(level) {
    var sysVar = ccuApi_1.getSysMgr().getVariableByName(myConfig.jobs.LevelJetImport.name);
    var measure = InfluxExporter_1.getMeasureFromConfig(myConfig.jobs.LevelJetImport.name);
    ccuApi_1.setValueToSysVar(sysVar, level.fheight);
    if (measure) {
        InfluxExporter_1.exportVariable(measure, sysVar);
    }
    else {
        logger_1.logger.warn('NOT Found ---> ' + myConfig.jobs.LevelJetImport.name);
    }
    var sysVar2 = ccuApi_1.getSysMgr().getVariableByName(myConfig.jobs.LevelJetImport.name);
}
//# sourceMappingURL=main.js.map