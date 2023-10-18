'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var logger_1 = require("./logger");
var config = require('config');
var myConfig = config.get('hm-node-runner');
logger_1.logger.info('Configuration directory: ' + config.util.getEnv('NODE_CONFIG_DIR'));
logger_1.logger.info(package_json_1.default.name + ' ' + package_json_1.default.version + ' (' + myConfig.mainSetting.env + ')');
var express_1 = tslib_1.__importDefault(require("express"));
var healthcheck_1 = require("./routes/healthcheck");
var ccuData_1 = require("./routes/ccuData");
var Status_1 = require("./routes/healthcheck/Status");
var ccuWorker_1 = require("./jobs/ccuWorker");
var km200Worker_1 = require("./jobs/km200Worker");
var leveljetWorker_1 = require("./jobs/leveljetWorker");
var status = new Status_1.Status();
var expressApp = (0, express_1.default)();
(0, healthcheck_1.defineExpressRouteStatus)(status, expressApp);
(0, ccuData_1.defineExpressRouteCCUData)(expressApp);
expressApp.listen(myConfig.healthcheck.port, function () {
    logger_1.logger.info("server started at http://localhost:".concat(myConfig.healthcheck.port));
});
var ccuWorker = new ccuWorker_1.CcuWorker(status);
ccuWorker.init();
var km200Worker = new km200Worker_1.Km200Worker(status);
km200Worker.init();
var leveljetWorker = new leveljetWorker_1.LeveljetWorker(status);
leveljetWorker.init();
setTimeout(startPollingIntervall, 5000);
logger_1.logger.info('Startup finished');
function startPollingIntervall() {
    logger_1.logger.info('Start intervall polling of current values');
    ccuWorker.startPolling();
    km200Worker.startPolling();
    leveljetWorker.startPolling();
}
//# sourceMappingURL=main.js.map