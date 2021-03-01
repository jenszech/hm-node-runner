"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelData = exports.ExportInterval = exports.LevelJetConnector = exports.levelJetStatistic = void 0;
var FileExporter_1 = require("./FileExporter");
var SerialListener_1 = require("./SerialListener");
var LevelJetModel_1 = require("./LevelJetModel");
var logger_1 = require("../logger");
exports.levelJetStatistic = {
    lastUpdateTime: new Date(),
    lastChangeTime: new Date(),
    fuel: 0,
    failureRate: 0,
};
var LevelJetConnector = (function () {
    function LevelJetConnector(serialInterface) {
        this.levelUpdateCallback = null;
        this.enableFileExport = false;
        this.level = new LevelJetModel_1.LevelData(null);
        this.fileExporter = new FileExporter_1.FileExporter('LevelExport.csv');
        this.serial = new SerialListener_1.SerialListener(serialInterface, this.levelUpdateHandler.bind(this));
        this.serial.startListener();
    }
    LevelJetConnector.prototype.setLevelUpdateCallback = function (callback) {
        this.levelUpdateCallback = callback;
    };
    LevelJetConnector.prototype.setExport = function (enableExport, filePath, interval) {
        if (filePath) {
            this.fileExporter.file = filePath;
        }
        if (interval) {
            this.fileExporter.exportInterval = FileExporter_1.ExportInterval[interval];
        }
        this.enableFileExport = enableExport;
    };
    LevelJetConnector.prototype.levelUpdateHandler = function (level) {
        if (this.enableFileExport) {
            this.fileExporter.exportLevel(level);
        }
        if (this.levelUpdateCallback) {
            if (FileExporter_1.FileExporter.isTimeToExport(level, this.level, FileExporter_1.ExportInterval.every_minute) ||
                level.distanz !== this.level.distanz) {
                logger_1.logger.info('levelUpdateHandler' + level.fheight);
                this.levelUpdateCallback(level);
                exports.levelJetStatistic.lastChangeTime = new Date();
            }
        }
        this.level.copy(level);
        exports.levelJetStatistic.fuel = this.level.fheight;
        exports.levelJetStatistic.lastUpdateTime = this.level.lastUpdateTime;
        exports.levelJetStatistic.failureRate = this.serial.calcErrorRate();
    };
    return LevelJetConnector;
}());
exports.LevelJetConnector = LevelJetConnector;
var FileExporter_2 = require("./FileExporter");
Object.defineProperty(exports, "ExportInterval", { enumerable: true, get: function () { return FileExporter_2.ExportInterval; } });
var LevelJetModel_2 = require("./LevelJetModel");
Object.defineProperty(exports, "LevelData", { enumerable: true, get: function () { return LevelJetModel_2.LevelData; } });
//# sourceMappingURL=leveljetConnector.js.map