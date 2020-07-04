'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var InfluxExporter_1 = require("./src/InfluxExporter");
var ccuApi_1 = require("./src/ccuApi");
var package_json_1 = tslib_1.__importDefault(require("./package.json"));
var logger_1 = require("./src/logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
logger_1.logger.info(package_json_1.default.name + ' ' + package_json_1.default.version + ' (' + myConfig.mainSetting.env + ')');
logger_1.logger.info('Collect DeviceList from CCU');
ccuApi_1.getDeviceList();
setTimeout(startPollingIntervall, 5000);
function startPollingIntervall() {
    logger_1.logger.info('Start intervall polling of current values');
    updateCurrentStates();
    setInterval(function () { return updateCurrentStates(); }, myConfig.CCU.pollingIntervall * 1000);
}
function updateCurrentStates() {
    logger_1.logger.debug('start updating current states');
    ccuApi_1.getCurrentStates().then(function (devMgr) {
        logger_1.logger.info('... Current devices: ' + devMgr.mapCount());
        InfluxExporter_1.exportValues(devMgr);
    });
}
logger_1.logger.info('Startup finished');
//# sourceMappingURL=app.js.map