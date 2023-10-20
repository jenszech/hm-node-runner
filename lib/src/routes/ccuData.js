"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExpressRouteCCUData = void 0;
var tslib_1 = require("tslib");
var ccuApi_1 = require("../utils/ccuApi");
function defineExpressRouteCCUData(expressApp) {
    expressApp.get('/data/variable', function (req, res) {
        res.send(getSysJson());
    });
    expressApp.get('/data/device', function (req, res) {
        res.send(getDeviceJson());
    });
}
exports.defineExpressRouteCCUData = defineExpressRouteCCUData;
function getSysJson() {
    var e_1, _a;
    var variable = [];
    var obj = (0, ccuApi_1.getSysMgr)().getVariablesRaw();
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
function getDeviceJson() {
    var e_2, _a;
    var variable = [];
    var obj = (0, ccuApi_1.getDevMgr)().getDevicesRaw();
    try {
        for (var _b = tslib_1.__values(obj.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var devVar = _c.value;
            variable.push(devVar);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return variable;
}
//# sourceMappingURL=ccuData.js.map