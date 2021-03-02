"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExpressRouteCCUData = void 0;
var tslib_1 = require("tslib");
var ccuApi_1 = require("../utils/ccuApi");
function defineExpressRouteCCUData(expressApp) {
    expressApp.get('/data', function (req, res) {
        res.send(getJson());
    });
}
exports.defineExpressRouteCCUData = defineExpressRouteCCUData;
function getJson() {
    var e_1, _a;
    var variable = [];
    var obj = ccuApi_1.getSysMgr().getVariablesRaw();
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
//# sourceMappingURL=ccuData.js.map