"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialListener = void 0;
var logger_1 = require("../logger");
var LevelJetModel_1 = require("./LevelJetModel");
var SerialPort = require('serialport');
var InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
var crc16 = require('easy-crc').crc16;
var MAX_COUNT_LENGTH = 60 * 60 * 24;
var SerialListener = (function () {
    function SerialListener(serialInterface, callback) {
        var _this = this;
        this.port = null;
        this.parser = new InterByteTimeout({ interval: 30 });
        this.countFailure = 0;
        this.countSuccess = 0;
        this.level = new LevelJetModel_1.LevelData(null);
        this.levelUpdateCallback = callback;
        this.serialInterface = serialInterface;
        this.port = this.initiatePort();
        this.port.pipe(this.parser);
        this.parser.on('data', function (data) {
            if (_this.parseSerialDataBuffer(data)) {
                _this.levelUpdateCallback(_this.level);
            }
            return;
        });
        this.port.on('open', function () {
            logger_1.logger.info('Connected to serial interface: ' + _this.serialInterface);
        });
        this.port.on('close', function () {
            logger_1.logger.info('Close serial interface: ' + _this.serialInterface);
        });
        this.port.on('error', function (err) {
            logger_1.logger.error(err);
        });
    }
    SerialListener.prototype.startListener = function () {
        this.port.open();
    };
    SerialListener.prototype.stopListener = function () {
        this.port.close(function (err) {
            logger_1.logger.error(err);
        });
    };
    SerialListener.prototype.initiatePort = function () {
        return new SerialPort(this.serialInterface, {
            baudRate: 19200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            autoOpen: false,
        }, function (err) {
            if (err) {
                return logger_1.logger.error(err);
            }
        });
    };
    SerialListener.prototype.calcCheckSum = function (data) {
        return crc16('BUYPASS', data.slice(0, 10)).toString(16);
    };
    SerialListener.prototype.isValidDataPackage = function (data) {
        var recCrc = data[11] * 256 + data[10];
        return recCrc.toString(16) === this.calcCheckSum(data);
    };
    SerialListener.prototype.parseSerialDataBuffer = function (data) {
        this.resetCounter();
        if (this.isValidDataPackage(data)) {
            this.countSuccess++;
            this.level.update(data);
            return true;
        }
        else {
            this.countFailure++;
            return false;
        }
    };
    SerialListener.prototype.resetCounter = function () {
        if (this.countFailure + this.countSuccess > MAX_COUNT_LENGTH) {
            this.countSuccess = 0;
            this.countFailure = 0;
        }
    };
    SerialListener.prototype.calcErrorRate = function () {
        return (this.countFailure / (this.countSuccess + this.countFailure)) * 100.0;
    };
    return SerialListener;
}());
exports.SerialListener = SerialListener;
//# sourceMappingURL=SerialListener.js.map