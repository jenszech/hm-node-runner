import { XmlApi, DeviceManager } from "homematic-js-xmlapi"
import {exportValues } from './src/InfluxExporter'

var pjson = require('./package.json');
var winston = require('./config/winston');
const { loggers } = require('winston')
const logger = loggers.get('appLogger');

const config = require('config');
const myconfig = config.get('hm2influx');

logger.info("hm2influx " + pjson.version);

const devMgr = new DeviceManager();
const xmlApi = new XmlApi(myconfig.CCU.host, myconfig.CCU.port);

//queryInflux("Bewegung", "Garten", "Sensor.Garten.Einfahrt")

xmlApi.getDeviceList().then((deviceList) => {
  if (deviceList) devMgr.updateDeviceList(deviceList);
});
xmlApi.getStateList().then((deviceList) => {
  if (deviceList) devMgr.updateDeviceList(deviceList);
});

setTimeout(test, 10000);
function test () {
  //devMgr.printDeviceList();
  devMgr.printDeviceTypes();

  console.log("---------------------------------------------");
  exportValues(devMgr);
  console.log("---------------------------------------------");
  console.log("FInish");
}

//runIntervall = function() {
//    setInterval(function () {
//        console.log("Hello");
//    }, 5000);
//};
//setTimeout(runIntervall, 5000);

console.log("Finished")