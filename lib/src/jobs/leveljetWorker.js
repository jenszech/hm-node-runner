"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeveljetWorker = void 0;
var ccuApi_1 = require("../utils/ccuApi");
var logger_1 = require("../logger");
var InfluxExporter_1 = require("../utils/InfluxExporter");
var leveljetConnector_1 = require("../leveljet/leveljetConnector");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var LeveljetWorker = (function () {
    function LeveljetWorker(status) {
        this.status = status;
        this.levelCon = new leveljetConnector_1.LevelJetConnector(myConfig.jobs.LevelJetImport.serialInterface);
    }
    LeveljetWorker.prototype.init = function () {
        if (this.levelCon === null)
            return;
        this.levelCon.setLevelUpdateCallback(this.levelUpdate.bind(this));
    };
    LeveljetWorker.prototype.startPolling = function () {
        if (this.levelCon === null)
            return;
        var conf = myConfig.jobs.LevelJetImport;
        this.levelCon.setExport(conf.enableFileExport, conf.exportFile, conf.exportIntervall);
    };
    LeveljetWorker.prototype.levelUpdate = function (level) {
        var sysVar = (0, ccuApi_1.getSysMgr)().getVariableByName(myConfig.jobs.LevelJetImport.name);
        var measure = (0, InfluxExporter_1.getMeasureFromConfig)(myConfig.jobs.LevelJetImport.name);
        (0, ccuApi_1.setValueToSysVar)(sysVar, level.fheight);
        if (measure) {
            (0, InfluxExporter_1.exportVariable)(measure, sysVar);
        }
        else {
            logger_1.logger.warn('NOT Found ---> ' + myConfig.jobs.LevelJetImport.name);
        }
    };
    return LeveljetWorker;
}());
exports.LeveljetWorker = LeveljetWorker;
//# sourceMappingURL=leveljetWorker.js.map