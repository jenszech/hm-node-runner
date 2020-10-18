'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelData = void 0;
var LevelData = (function () {
    function LevelData(data) {
        this.device = 0;
        this.distanz = 0;
        this.fheight = 0;
        this.fvol = 0;
        this.pct = 0;
        this.crc = 0;
        this.lastUpdateTime = new Date();
        if (data === null)
            return;
        this.update(data);
    }
    LevelData.prototype.update = function (data) {
        if (Buffer.isBuffer(data)) {
            this.updateByBuffer(data);
        }
        else {
            this.copy(data);
        }
        this.lastUpdateTime = new Date();
    };
    LevelData.prototype.updateByBuffer = function (data) {
        this.device = data[1] * 256 + data[0];
        this.distanz = data[3] * 256 + data[2];
        this.fheight = data[5] * 256 + data[4];
        this.fvol = 10 * (data[7] * 256 + data[6]);
        this.pct = data[8];
        this.crc = data[11] * 256 + data[10];
    };
    LevelData.prototype.copy = function (data) {
        this.device = data.device;
        this.distanz = data.distanz;
        this.fheight = data.fheight;
        this.fvol = data.fvol;
        this.pct = data.pct;
        this.crc = data.crc;
        this.lastUpdateTime = data.lastUpdateTime;
    };
    LevelData.prototype.toString = function () {
        return ('' +
            this.device +
            ',' +
            this.pct +
            ',' +
            this.distanz +
            ',' +
            this.fheight +
            ',' +
            this.fvol +
            ',' +
            this.crc);
    };
    LevelData.prototype.toLogString = function () {
        return ('' + this.getNiceLastUpdatedTime() + ',' + this.pct + ',' + this.distanz + ',' + this.fheight);
    };
    LevelData.prototype.getNiceLastUpdatedTime = function () {
        var optDate = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        var optTime = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return (this.lastUpdateTime.toLocaleDateString('de-DE', optDate) +
            ',' +
            this.lastUpdateTime.toLocaleTimeString('de-DE', optTime));
    };
    return LevelData;
}());
exports.LevelData = LevelData;
//# sourceMappingURL=LevelJetModel.js.map