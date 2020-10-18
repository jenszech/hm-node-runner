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
        InfluxExporter_1.exportVariables(ccuApi_1.getSysMgr());
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
    });
}
function levelUpdate(level) {
    ccuApi_1.setValue(myConfig.jobs.LevelJetImport.name, level.fheight);
    var measure = InfluxExporter_1.getMeasureFromConfig(myConfig.jobs.LevelJetImport.name);
    InfluxExporter_1.exportVariable(measure, ccuApi_1.getSysMgr());
}
function initLeveljet() {
    var conf = myConfig.jobs.LevelJetImport;
    var levelCon = new leveljetConnector_1.LevelJetConnector(conf.serialInterface);
    levelCon.setExport(conf.enableFileExport === 'true', conf.exportFile, conf.exportIntervall);
    return levelCon;
}
//# sourceMappingURL=main.js.map