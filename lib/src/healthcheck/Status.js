'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var Status = (function () {
    function Status() {
        this.serviceStart = new Date();
        this.deviceStats = new homematic_js_xmlapi_1.DeviceStatistic();
    }
    Status.prototype.getJson = function () {
        return {
            health: 'OK',
            StartTime: this.serviceStart,
            Device: {
                LastUpdate: {
                    Updated: this.deviceStats.lastUpdateCount,
                    Timestamp: this.deviceStats.lastUpdateTime,
                },
                Devices: this.deviceStats.deviceCount,
                Channels: this.deviceStats.channelCount,
                DataPoints: this.deviceStats.datapointCount,
            },
        };
    };
    return Status;
}());
exports.Status = Status;
//# sourceMappingURL=Status.js.map