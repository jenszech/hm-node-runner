"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentStates = exports.getDeviceList = void 0;
var homematic_js_xmlapi_1 = require("homematic-js-xmlapi");
var logger_1 = require("./logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var devMgr = new homematic_js_xmlapi_1.DeviceManager();
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
//# sourceMappingURL=ccuApi.js.map