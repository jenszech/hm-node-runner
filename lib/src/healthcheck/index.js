"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStatusApp = void 0;
var logger_1 = require("../logger");
var Status_1 = require("./Status");
var status2 = new Status_1.Status();
function initStatusApp(status, statusApp) {
    status2 = status;
    logger_1.logger.info('Initialise http listening');
    statusApp.get('/', function (req, res) {
        res.send(status2.getJson());
    });
}
exports.initStatusApp = initStatusApp;
//# sourceMappingURL=index.js.map