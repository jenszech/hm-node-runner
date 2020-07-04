"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var tslib_1 = require("tslib");
var app_root_path_1 = tslib_1.__importDefault(require("app-root-path"));
var winston_1 = require("winston");
var config = require('config');
var myConfig = config.get('hm-node-runner.mainSetting');
var options = {
    file: {
        level: myConfig.logLevel,
        filename: app_root_path_1.default + "/logs/app.log",
        handleExceptions: true,
        humanReadableUnhandledException: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    errorfile: {
        level: 'error',
        filename: app_root_path_1.default + "/logs/error.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
var logger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.printf(function (info) { return info.timestamp + " " + info.level + ": " + info.message; })),
    transports: [
        new winston_1.transports.File(options.errorfile),
        new winston_1.transports.File(options.file)
    ],
    exitOnError: false,
});
exports.logger = logger;
if (process.env.NODE_ENV !== 'prod') {
    logger.add(new winston_1.transports.Console({
        level: 'debug',
        format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.colorize(), winston_1.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }), winston_1.format.printf(function (info) { return info.timestamp + " " + info.level + ": " + info.message; })),
    }));
}
process.on('uncaughtException', function (error) {
    logger.error(error.message);
    logger.error(error.stack);
});
//# sourceMappingURL=logger.js.map