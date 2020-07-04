"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStatusApp = void 0;
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var logger_1 = require("../logger");
var Status_1 = require("./Status");
var config = require('config');
var myConfig = config.get('hm-node-runner');
var status2 = new Status_1.Status();
function initStatusApp(status) {
    var statusApp = express_1.default();
    var port = myConfig.healthcheck.port;
    status2 = status;
    logger_1.logger.info('Initialise http listening');
    statusApp.get('/', function (req, res) {
        res.send(status2.getJson());
    });
    statusApp.listen(port, function () {
        logger_1.logger.info("server started at http://localhost:" + port);
    });
}
exports.initStatusApp = initStatusApp;
//# sourceMappingURL=index.js.map