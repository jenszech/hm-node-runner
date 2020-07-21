"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToInflux = exports.queryInflux = void 0;
var influx_1 = require("influx");
var config = require('config');
var logger_1 = require("../logger");
var myConfig = config.get('hm-node-runner');
var influx = new influx_1.InfluxDB({
    host: myConfig.jobs.influxExport.host,
    database: myConfig.jobs.influxExport.database,
    schema: [
        {
            measurement: myConfig.jobs.influxExport.measurement,
            fields: {
                value: influx_1.FieldType.FLOAT,
            },
            tags: ['type', 'area', 'name'],
        },
    ],
});
function queryInflux(type, area, name) {
    influx
        .query("\n            SELECT * FROM homematic\n            WHERE \"type\" = '" +
        type +
        "' and \"area\" = '" +
        area +
        "' and \"name\" = '" +
        name +
        "' order by time desc limit 10")
        .then(function (result) {
        logger_1.logger.debug(result);
    })
        .catch(function (error) {
        logger_1.logger.error(error);
    });
}
exports.queryInflux = queryInflux;
function postToInflux(type, area, name, value) {
    influx
        .writePoints([
        {
            measurement: 'homematic',
            tags: {
                type: type,
                area: area,
                name: name,
            },
            fields: { value: value },
        },
    ])
        .catch(function (error) {
        logger_1.logger.error(error);
    });
}
exports.postToInflux = postToInflux;
//# sourceMappingURL=InfluxConnector.js.map