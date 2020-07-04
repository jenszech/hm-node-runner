import appRoot from 'app-root-path';
import { createLogger, transports, format } from 'winston';

const config = require('config');
const myConfig = config.get('hm-node-runner.mainSetting');

const options = {
  file: {
    level: myConfig.logLevel,
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  errorfile: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
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

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [new transports.File(options.errorfile), new transports.File(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.simple(),
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  );
}

process.on('uncaughtException', (error) => {
  logger.error(error.message);
  logger.error(error.stack);
});
export { logger };
