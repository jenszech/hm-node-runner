"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExporter = exports.ExportInterval = void 0;
var tslib_1 = require("tslib");
var logger_1 = require("../logger");
var fs_1 = tslib_1.__importDefault(require("fs"));
var LevelJetModel_1 = require("./LevelJetModel");
var ExportInterval;
(function (ExportInterval) {
    ExportInterval[ExportInterval["every_second"] = 1] = "every_second";
    ExportInterval[ExportInterval["every_minute"] = 2] = "every_minute";
    ExportInterval[ExportInterval["hourly"] = 3] = "hourly";
    ExportInterval[ExportInterval["daily"] = 4] = "daily";
})(ExportInterval = exports.ExportInterval || (exports.ExportInterval = {}));
var FileExporter = (function () {
    function FileExporter(logFile) {
        this.file = '';
        this.exportInterval = ExportInterval.every_minute;
        this.exportedLevel = new LevelJetModel_1.LevelData(null);
        this.file = logFile;
    }
    FileExporter.prototype.exportLevel = function (level) {
        if (FileExporter.isTimeToExport(level, this.exportedLevel, this.exportInterval)) {
            this.exportedLevel.copy(level);
            this.writeLog(this.exportedLevel.toLogString());
            logger_1.logger.info('Exported');
        }
    };
    FileExporter.prototype.writeLog = function (data) {
        try {
            fs_1.default.appendFileSync(this.file, data + '\n');
        }
        catch (err) {
            logger_1.logger.error('Fehler beim Dateischreiben: ', err);
        }
    };
    FileExporter.isTimeToExport = function (lvl1, lvl2, interval) {
        switch (interval) {
            case ExportInterval.every_second:
                return lvl1.lastUpdateTime.getSeconds() !== lvl2.lastUpdateTime.getSeconds();
            case ExportInterval.every_minute:
                return lvl1.lastUpdateTime.getMinutes() !== lvl2.lastUpdateTime.getMinutes();
            case ExportInterval.hourly:
                return lvl1.lastUpdateTime.getHours() !== lvl2.lastUpdateTime.getHours();
            case ExportInterval.daily:
                return lvl1.lastUpdateTime.getDay() !== lvl2.lastUpdateTime.getDay();
        }
        return false;
    };
    return FileExporter;
}());
exports.FileExporter = FileExporter;
//# sourceMappingURL=FileExporter.js.map