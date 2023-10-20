"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExpressRouteLogging = void 0;
var logger_1 = require("../logger");
function defineExpressRouteLogging(expressApp) {
    expressApp.get('/api/time', function (req, res) {
        res.set('Content-Type', 'application/json');
        res.send(getTime());
    });
}
exports.defineExpressRouteLogging = defineExpressRouteLogging;
function getTime() {
    var today = new Date();
    var now = today.toTimeString().substring(0, 8);
    var result = {
        time: now
    };
    logger_1.logger.info("Time requested at ".concat(now));
    return result;
}
//# sourceMappingURL=logData.js.map