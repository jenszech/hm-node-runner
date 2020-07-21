"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setValuesList = exports.getCurrentStates = exports.getCurrentVariables = exports.getDeviceList = void 0;
var tslib_1 = require("tslib");
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var logger_1 = require("../logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var devMgr = new homematic_js_xmlapi_1.DeviceManager();
var sysMgr = new homematic_js_xmlapi_1.SystemVariableManager();
var xmlApi = new homematic_js_xmlapi_1.XmlApi(myConfig.CCU.host, myConfig.CCU.port);
function getDeviceList() {
    xmlApi
        .getDeviceList()
        .then(function (deviceList) {
        if (deviceList)
            devMgr.updateDeviceList(deviceList);
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
    });
}
exports.getDeviceList = getDeviceList;
function getCurrentVariables() {
    return xmlApi
        .getSysVarList()
        .then(function (sysList) {
        if (sysList)
            sysMgr.updateSysVarList(sysList);
        return sysMgr;
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
        return Promise.reject();
    });
}
exports.getCurrentVariables = getCurrentVariables;
function getCurrentStates() {
    return xmlApi
        .getStateList()
        .then(function (deviceList) {
        if (deviceList)
            devMgr.updateDeviceList(deviceList);
        return devMgr;
    })
        .catch(function (error) {
        logger_1.logger.error('ERROR:', error);
        return Promise.reject();
    });
}
exports.getCurrentStates = getCurrentStates;
function setValuesList(valueMap) {
    var e_1, _a;
    try {
        for (var _b = tslib_1.__values(valueMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var value = _c.value;
            var sysvar = sysMgr.getVariableByName(value[0]);
            if (sysvar) {
                setValue(sysvar.iseId, value[1]);
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
exports.setValuesList = setValuesList;
function setValue(id, value) {
    xmlApi.setState(id, convertValue(value)).catch(function (error) {
        logger_1.logger.error('ERROR:', error);
    });
}
function convertValue(value) {
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    else {
        return value;
    }
}
//# sourceMappingURL=ccuApi.js.map