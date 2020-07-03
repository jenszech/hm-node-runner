import {DeviceManager, DataType, ValueType} from "homematic-js-xmlapi";
import {postToInflux} from "./InfluxConnector";

const { loggers } = require('winston')
const logger = loggers.get('appLogger');

const config = require('config');
const myconfig = config.get('hm2influx');


export function exportValues(devMgr: DeviceManager) {
    if (myconfig.has("exportValues")) {
        for (let measure of myconfig.exportValues) {
            let device = devMgr.getChannelByName(measure.name);
            if (device) {
                let type = parseInt(DataType[measure.data], 10)

                //console.log(dev1?.iseId, dev1?.name, value);
                if (device.dataPoint?.get(type)?.valueType === ValueType.Number) {
                    let value = <number>device.dataPoint?.get(type)?.value
                    postToInflux(measure.dataName, measure.area, device?.name, value);
                } else {
                    logger.warn("NOT a number ---> "+ measure.name + " : " + device.dataPoint?.get(type)?.value + " ("+device.dataPoint?.get(type)?.valueType+")");
                }
            } else {
                logger.warn("NOT Found ---> "+ measure.name)
            }
        }
    }
}

