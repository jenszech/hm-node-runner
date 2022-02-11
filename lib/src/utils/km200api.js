"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKm200Values = exports.getKm200Value = exports.km200Statistic = void 0;
var tslib_1 = require("tslib");
var km200_api_1 = require("km200-api");
var logger_1 = require("../logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var km200api = new km200_api_1.Km200(myConfig.jobs.km200Import.host, myConfig.jobs.km200Import.port, myConfig.jobs.km200Import.key);
exports.km200Statistic = {
    lastUpdateCount: 0,
    lastUpdateTime: new Date(),
    variableCount: 0,
};
function getKm200Value(api) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            return [2, importValue(api)];
        });
    });
}
exports.getKm200Value = getKm200Value;
function getKm200Values() {
    if (myConfig.jobs.influxExport.has('exportValues')) {
        return importAllValuesFromConfig();
    }
    return Promise.reject();
}
exports.getKm200Values = getKm200Values;
function importAllValuesFromConfig() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var valueMap, count, _a, _b, measure, value, e_1_1;
        var e_1, _c;
        return (0, tslib_1.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0:
                    valueMap = new Map();
                    count = 0;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    _a = (0, tslib_1.__values)(myConfig.jobs.km200Import.importValues), _b = _a.next();
                    _d.label = 2;
                case 2:
                    if (!!_b.done) return [3, 5];
                    measure = _b.value;
                    return [4, importValue(measure.api)];
                case 3:
                    value = _d.sent();
                    valueMap.set(measure.name, value);
                    count++;
                    _d.label = 4;
                case 4:
                    _b = _a.next();
                    return [3, 2];
                case 5: return [3, 8];
                case 6:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7];
                case 8:
                    exports.km200Statistic.lastUpdateCount = count;
                    exports.km200Statistic.lastUpdateTime = new Date();
                    exports.km200Statistic.variableCount = valueMap.size;
                    return [2, valueMap];
            }
        });
    });
}
function importValue(api) {
    return km200api
        .getKM200(api)
        .then(function (data) {
        return convertData(data.value, data.type);
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
        return Promise.reject();
    });
}
function convertData(data, type) {
    switch (type) {
        case 'floatValue':
            return parseFloat(data);
            break;
        case 'stringValue':
            if (data === 'on' || data === 'off')
                return data === 'on';
            return data;
            break;
    }
    return null;
}
//# sourceMappingURL=km200api.js.map