import { XmlApi } from "homematic-js-xmlapi"
import DeviceManager from "./src/DeviceManager";

var pjson = require('./package.json');
var winston = require('./config/winston');
const { loggers } = require('winston')
const logger = loggers.get('appLogger');

const argv = require('minimist')(process.argv.slice(2));
// // Check whether host is set via cli arguments or environment
const host = argv.host || process.env.HOST || '0.0.0.0'
// Check whether port is set via cli arguments or environment
const port = argv.port || process.env.PORT || 80;

logger.info("Homematic LevelJET connector " + pjson.version);
console.log("Hello World")

const devMgr = new DeviceManager();
const xmlApi = new XmlApi(host, port);
xmlApi.getDeviceList(devMgr.updateCallback);
setTimeout(test, 5000);

function test () {
    console.log("Run Test");
    xmlApi.getState("1481", devMgr.updateCallback);
}

//xmlApi.getSysVarList();
//xmlApi.getSysVar("17257");
//xmlApi.getStateList();
//xmlApi.getState("1481");

//runIntervall = function() {
//    setInterval(function () {
//        console.log("Hello");
//    }, 5000);
//};
//setTimeout(runIntervall, 5000);

console.log("Finished")