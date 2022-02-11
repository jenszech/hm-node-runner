'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var tslib_1 = require("tslib");
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var km200api_1 = require("../../utils/km200api");
var package_json_1 = (0, tslib_1.__importDefault)(require("../../../package.json"));
var leveljetConnector_1 = require("../../leveljet/leveljetConnector");
var config = require('config');
var myConfig = config.get('hm-node-runner');
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
            version: package_json_1.default.version + ' (' + myConfig.mainSetting.env + ')',
            CCU: {
                Host: myConfig.CCU.host,
                PollingIntervall: myConfig.CCU.pollingIntervall,
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
                Host: myConfig.jobs.km200Import.host,
                PollingIntervall: myConfig.jobs.km200Import.pollingIntervall,
                LastUpdate: {
                    Updated: km200api_1.km200Statistic.lastUpdateCount,
                    Timestamp: km200api_1.km200Statistic.lastUpdateTime,
                },
                Variables: km200api_1.km200Statistic.variableCount,
            },
            LevelJet: {
                Interface: myConfig.jobs.LevelJetImport.serialInterface,
                Export: {
                    Enabled: myConfig.jobs.LevelJetImport.enableFileExport,
                    File: myConfig.jobs.LevelJetImport.exportFile,
                    Interval: myConfig.jobs.LevelJetImport.exportIntervall,
                },
                LastUpdate: {
                    Updated: leveljetConnector_1.levelJetStatistic.lastUpdateTime,
                    Changed: leveljetConnector_1.levelJetStatistic.lastChangeTime,
                    Failure: leveljetConnector_1.levelJetStatistic.failureRate,
                    Fuel: leveljetConnector_1.levelJetStatistic.fuel,
                },
            },
        };
    };
    return Status;
}());
exports.Status = Status;
//# sourceMappingURL=Status.js.map