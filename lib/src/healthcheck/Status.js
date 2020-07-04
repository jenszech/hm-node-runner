'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status = (function () {
    function Status() {
        this.serviceStart = new Date();
        this.lastDeviceUpdateCount = 0;
        this.lastDeviceUpdateTime = new Date();
        this.deviceCount = 0;
        this.channelCount = 0;
        this.datapointCount = 0;
    }
    Status.prototype.getJson = function () {
        return {
            health: 'OK',
            StartTime: this.serviceStart,
            Device: {
                LastUpdate: {
                    Updated: this.lastDeviceUpdateCount,
                    Timestamp: this.lastDeviceUpdateTime,
                },
                Devices: this.deviceCount,
                Channels: this.channelCount,
                Datapoints: this.datapointCount,
            },
        };
    };
    return Status;
}());
exports.Status = Status;
//# sourceMappingURL=Status.js.map