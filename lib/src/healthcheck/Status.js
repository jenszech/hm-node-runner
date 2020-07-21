'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var km200Importer_1 = require("../jobs/km200Importer");
var Status = (function () {
    function Status() {
        this.serviceStart = new Date();
        this.deviceStats = new homematic_js_xmlapi_1.DeviceStatistic();
        this.variableStats = new homematic_js_xmlapi_1.VariableStatistic();
    }
    Status.prototype.getJson = function () {
        return {
            health: 'OK',
            StartTime: this.serviceStart,
            CCU: {
                Device: {
                    LastUpdate: {
                        Updated: this.deviceStats.lastUpdateCount,
                        Timestamp: this.deviceStats.lastUpdateTime,
                    },
                    Devices: this.deviceStats.deviceCount,
                    Channels: this.deviceStats.channelCount,
                    DataPoints: this.deviceStats.datapointCount,
                },
                Variable: {
                    LastUpdate: {
                        Updated: this.variableStats.lastUpdateCount,
                        Timestamp: this.variableStats.lastUpdateTime,
                    },
                    Variables: this.variableStats.variableCount,
                },
            },
            KM200: {
                LastUpdate: {
                    Updated: km200Importer_1.km200Statistic.lastUpdateCount,
                    Timestamp: km200Importer_1.km200Statistic.lastUpdateTime,
                },
                Variables: km200Importer_1.km200Statistic.variableCount,
            },
        };
    };
    return Status;
}());
exports.Status = Status;
//# sourceMappingURL=Status.js.map