import { InfluxDB, FieldType, escape } from 'influx';
const config = require('config');

    const myconfig = config.get('hm2influx');
    const influx = new InfluxDB({
        host: 'smartpi',
        database: 'smartdb',
        schema: [
            {
                measurement: 'homematic',
                fields: {
                    value: FieldType.FLOAT,
                },
                tags: [
                    'type',
                    'area',
                    'name'
                ]
            }
        ]
    })

    export function queryInflux(type: string, area: string, name: string) {
        influx.query(`
            SELECT * FROM homematic
            WHERE "type" = '`+ type + `' and "area" = '`+ area + `' and "name" = '`+ name + `' 
            order by time desc
            limit 10
          `).then(result => {
          console.log(result)
        }).catch(err => {
          console.error(err);
        })
    }

    export function postToInflux(type: string, area: string, name: string, value: number) {
        console.log(type, area, name, value);
        // influx.writePoints([
        //     {
        //         measurement: 'homematic',
        //         tags: {
        //             type: type,
        //             area: area,
        //             name: name
        //         },
        //         fields: {value: value},
        //     }
        // ])
    }

