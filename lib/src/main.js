'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var InfluxExporter_1 = require("./influx/InfluxExporter");
var ccuApi_1 = require("./ccu/ccuApi");
var Status_1 = require("./healthcheck/Status");
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var logger_1 = require("./logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
logger_1.logger.info(package_json_1.default.name + ' ' + package_json_1.default.version + ' (' + myConfig.mainSetting.env + ')');
var status = new Status_1.Status();
var healthcheck_1 = require("./healthcheck");
healthcheck_1.initStatusApp(status);
logger_1.logger.info('Collect DeviceList from CCU');
ccuApi_1.getDeviceList();
setTimeout(startPollingIntervall, 5000);
logger_1.logger.info('Startup finished');
function startPollingIntervall() {
    logger_1.logger.info('Start intervall polling of current values');
    updateCurrentStates();
    setInterval(function () { return updateCurrentStates(); }, myConfig.CCU.pollingIntervall * 1000);
}
function updateCurrentStates() {
    logger_1.logger.debug('start updating current states');
    ccuApi_1.getCurrentStates().then(function (devMgr) {
        status.lastDeviceUpdateTime = new Date();
        status.deviceCount = devMgr.mapCount();
        logger_1.logger.info('... Current devices: ' + devMgr.mapCount());
        InfluxExporter_1.exportValues(devMgr);
    });
}
//# sourceMappingURL=main.js.map