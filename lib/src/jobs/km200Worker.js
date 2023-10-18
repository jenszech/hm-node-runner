"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Km200Worker = void 0;
var ccuApi_1 = require("../utils/ccuApi");
var logger_1 = require("../logger");
var InfluxExporter_1 = require("../utils/InfluxExporter");
var km200api_1 = require("../utils/km200api");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var Km200Worker = (function () {
    function Km200Worker(status) {
        this.status = status;
    }
    Km200Worker.prototype.init = function () {
        this.importKm200Values();
    };
    Km200Worker.prototype.startPolling = function () {
        var _this = this;
        if (myConfig.jobs.km200Import.enable === false)
            return;
        setInterval(function () { return _this.importKm200Values(); }, myConfig.jobs.km200Import.pollingIntervall * 1000);
    };
    Km200Worker.prototype.importKm200Values = function () {
        if (myConfig.jobs.km200Import.enable === false)
            return;
        logger_1.logger.debug('start updating km200 values');
        (0, km200api_1.getKm200Values)()
            .then(function (valueMap) {
            (0, ccuApi_1.setValuesList)(valueMap);
            logger_1.logger.debug('... Current KM200 Values: ' + km200api_1.km200Statistic.variableCount);
            (0, InfluxExporter_1.exportAllVariables)((0, ccuApi_1.getSysMgr)());
        })
            .catch(function (error) {
            logger_1.logger.error('ERROR:', error);
        });
    };
    return Km200Worker;
}());
exports.Km200Worker = Km200Worker;
//# sourceMappingURL=km200Worker.js.map