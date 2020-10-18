"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setValue = exports.setValuesList = exports.getCurrentStates = exports.getCurrentVariables = exports.getDeviceList = exports.getSysMgr = exports.initCcuApi = void 0;
var tslib_1 = require("tslib");
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var logger_1 = require("../logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var devMgr = new homematic_js_xmlapi_1.DeviceManager();
var sysMgr = new homematic_js_xmlapi_1.SystemVariableManager();
var xmlApi = new homematic_js_xmlapi_1.XmlApi(myConfig.CCU.host, myConfig.CCU.port);
function initCcuApi(expressApp) {
    expressApp.get('/data', function (req, res) {
        res.send(getJson());
    });
}
exports.initCcuApi = initCcuApi;
function getSysMgr() {
    return sysMgr;
}
exports.getSysMgr = getSysMgr;
function getJson() {
    var e_1, _a;
    var variable = [];
    var obj = sysMgr.getVariablesRaw();
    try {
        for (var _b = tslib_1.__values(obj.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var sysVar = _c.value;
            variable.push(sysVar);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return variable;
}
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
    var e_2, _a;
    try {
        for (var _b = tslib_1.__values(valueMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var value = _c.value;
            setValue(value[0], value[1]);
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
exports.setValuesList = setValuesList;
function setValue(valuename, value) {
    var sysvar = sysMgr.getVariableByName(valuename);
    if (sysvar) {
        setValueToCCU(sysvar.iseId, value);
    }
}
exports.setValue = setValue;
function setValueToCCU(id, value) {
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