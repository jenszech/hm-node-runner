"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasureFromConfig = exports.exportVariable = exports.exportMeasurement = exports.exportAllVariables = exports.exportValues = void 0;
var tslib_1 = require("tslib");
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var InfluxConnector_1 = require("./InfluxConnector");
var logger_1 = require("../logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
function exportValues(devMgr) {
    if (myConfig.jobs.influxExport.has('exportValues')) {
        exportAllValuesFromConfig(devMgr);
    }
}
exports.exportValues = exportValues;
function exportAllValuesFromConfig(devMgr) {
    var e_1, _a;
    try {
        for (var _b = tslib_1.__values(myConfig.jobs.influxExport.exportValues), _c = _b.next(); !_c.done; _c = _b.next()) {
            var measure = _c.value;
            if (measure.typ !== 'SYSVAR') {
                var channel = devMgr.getChannelByName(measure.name);
                if (channel) {
                    export2InfluxByType(channel, getType(measure.data), measure);
                }
                else {
                    logger_1.logger.warn('NOT Found ---> ' + measure.name);
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function export2InfluxByType(channel, type, measure) {
    var _a, _b, _c, _d;
    var dataPoint = getDataPoint(channel, type);
    if (dataPoint) {
        if ((dataPoint === null || dataPoint === void 0 ? void 0 : dataPoint.valueType) === homematic_js_xmlapi_1.ValueType.Number) {
            var value = dataPoint.value;
            (0, InfluxConnector_1.postToInflux)(measure.dataName, measure.area, channel === null || channel === void 0 ? void 0 : channel.name, value);
        }
        else if ((dataPoint === null || dataPoint === void 0 ? void 0 : dataPoint.valueType) === homematic_js_xmlapi_1.ValueType.Bool) {
            var value = dataPoint.value ? 1 : 0;
            (0, InfluxConnector_1.postToInflux)(measure.dataName, measure.area, channel === null || channel === void 0 ? void 0 : channel.name, value);
        }
        else if ((dataPoint === null || dataPoint === void 0 ? void 0 : dataPoint.valueType) === homematic_js_xmlapi_1.ValueType.List) {
            var value = dataPoint.value;
            (0, InfluxConnector_1.postToInflux)(measure.dataName, measure.area, channel === null || channel === void 0 ? void 0 : channel.name, value);
        }
        else {
            logger_1.logger.warn('NOT a number ---> ' +
                measure.name +
                ' : ' +
                ((_b = (_a = channel.dataPoint) === null || _a === void 0 ? void 0 : _a.get(type)) === null || _b === void 0 ? void 0 : _b.value) +
                ' (' +
                ((_d = (_c = channel.dataPoint) === null || _c === void 0 ? void 0 : _c.get(type)) === null || _d === void 0 ? void 0 : _d.valueType) +
                ')');
        }
    }
    else {
        logger_1.logger.warn('Datapoint undefined ---> ' + measure.name + ' : ' + channel.name + ' (' + measure.data + ')');
    }
}
function getType(typeStr) {
    return parseInt(homematic_js_xmlapi_1.DataType[typeStr], 10);
}
function getDataPoint(channel, type) {
    if (channel.dataPoint) {
        return channel.dataPoint.get(type);
    }
    return undefined;
}
function exportAllVariables(sysMgr) {
    if (myConfig.jobs.influxExport.has('exportValues')) {
        exportAllVariablesFromConfig(sysMgr);
    }
}
exports.exportAllVariables = exportAllVariables;
function exportMeasurement(measure, sysMgr) {
    var variable = sysMgr.getVariableByName(measure.name);
    exportVariable(measure, variable);
}
exports.exportMeasurement = exportMeasurement;
function exportVariable(measure, sysVar) {
    if (sysVar) {
        exportVariable2InfluxByType(sysVar, measure.dataName, measure.area);
    }
    else {
        logger_1.logger.warn('NOT Found ---> ' + measure.name);
    }
}
exports.exportVariable = exportVariable;
function exportAllVariablesFromConfig(sysMgr) {
    var e_2, _a;
    try {
        for (var _b = tslib_1.__values(myConfig.jobs.influxExport.exportValues), _c = _b.next(); !_c.done; _c = _b.next()) {
            var measure = _c.value;
            if (measure.typ === 'SYSVAR') {
                exportMeasurement(measure, sysMgr);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function exportVariable2InfluxByType(variable, name, area) {
    if ((variable === null || variable === void 0 ? void 0 : variable.valueType) === homematic_js_xmlapi_1.ValueType.Number) {
        var value = variable.value;
        (0, InfluxConnector_1.postToInflux)(name, area, variable === null || variable === void 0 ? void 0 : variable.name, value);
    }
    else if ((variable === null || variable === void 0 ? void 0 : variable.valueType) === homematic_js_xmlapi_1.ValueType.Bool) {
        var value = variable.value ? 1 : 0;
        (0, InfluxConnector_1.postToInflux)(name, area, variable === null || variable === void 0 ? void 0 : variable.name, value);
    }
    else if ((variable === null || variable === void 0 ? void 0 : variable.valueType) === homematic_js_xmlapi_1.ValueType.List) {
        var value = variable.value;
        (0, InfluxConnector_1.postToInflux)(name, area, variable === null || variable === void 0 ? void 0 : variable.name, value);
    }
}
function getMeasureFromConfig(name) {
    var e_3, _a;
    try {
        for (var _b = tslib_1.__values(myConfig.jobs.influxExport.exportValues), _c = _b.next(); !_c.done; _c = _b.next()) {
            var measure = _c.value;
            if (measure.name === name) {
                return measure;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return null;
}
exports.getMeasureFromConfig = getMeasureFromConfig;
//# sourceMappingURL=InfluxExporter.js.map