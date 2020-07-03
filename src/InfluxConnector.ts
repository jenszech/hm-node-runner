import { InfluxDB, FieldType } from 'influx';
const config = require('config');
import { logger } from './logger';

const myConfig = config.get('hm-node-runner');
const influx = new InfluxDB({
  host: 'smartpi',
  database: 'smartdb',
  schema: [
    {
      measurement: 'homematic',
      fields: {
        value: FieldType.FLOAT,
      },
      tags: ['type', 'area', 'name'],
    },
  ],
});

export function queryInflux(type: string, area: string, name: string) {
  influx
    .query(
      `
            SELECT * FROM homematic
            WHERE "type" = '` +
        type +
        `' and "area" = '` +
        area +
        `' and "name" = '` +
        name +
        `' order by time desc limit 10`,
    )
    .then((result) => {
      logger.debug(result);
    })
    .catch((error) => {
      logger.error(error);
    });
}

export function postToInflux(type: string, area: string, name: string, value: number) {
  //logger.debug(type + '@' + area + ' -> ' + name +': ' + value);
  influx.writePoints([
      {
          measurement: 'homematic',
          tags: {
              type: type,
              area: area,
              name: name
          },
          fields: {value: value},
      }
  ]).catch((error) => {
    logger.error(error);
  })
}
