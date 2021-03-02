"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExpressRouteStatus = void 0;
var logger_1 = require("../../logger");
var Status_1 = require("./Status");
var statusValue = new Status_1.Status();
function defineExpressRouteStatus(status, statusApp) {
    statusValue = status;
    logger_1.logger.info('Initialise http listening');
    statusApp.get('/', function (req, res) {
        res.send(statusValue.getJson());
    });
}
exports.defineExpressRouteStatus = defineExpressRouteStatus;
//# sourceMappingURL=index.js.map