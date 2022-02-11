"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CcuWorker = void 0;
var ccuApi_1 = require("../utils/ccuApi");
var logger_1 = require("../logger");
var InfluxExporter_1 = require("../utils/InfluxExporter");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var CcuWorker = (function () {
    function CcuWorker(status) {
        this.status = status;
    }
    CcuWorker.prototype.init = function () {
        var _this = this;
        logger_1.logger.info('Collect DeviceList from CCU');
        (0, ccuApi_1.getDeviceList)();
        (0, ccuApi_1.getCurrentVariables)().then(function (sysMgr) {
            _this.status.variableStats = sysMgr.getStatistic();
        });
    };
    CcuWorker.prototype.startPolling = function () {
        var _this = this;
        this.updateCurrentStates();
        setInterval(function () { return _this.updateCurrentStates(); }, myConfig.CCU.pollingIntervall * 1000);
    };
    CcuWorker.prototype.updateCurrentStates = function () {
        var _this = this;
        logger_1.logger.debug('start updating ccu values');
        (0, ccuApi_1.getCurrentStates)().then(function (devMgr) {
            _this.status.deviceStats = devMgr.getStatistic();
            logger_1.logger.debug('... Current devices: ' + _this.status.deviceStats.deviceCount);
            (0, InfluxExporter_1.exportValues)(devMgr);
        });
    };
    return CcuWorker;
}());
exports.CcuWorker = CcuWorker;
//# sourceMappingURL=ccuWorker.js.map