# hm-node-runner
A homematic nodejs script runner.

## Function
The script extends an existing Homematic CCU by an externally running server component. By means of Typescript various functions can be extended.

Current function:
* Export selected data (devices & system variables) to an InfluxDB.
* Retrieve data of a Buderus heater and import it into the Homematic CCU (As SystemVariable)
* Read data of a serial level sensor and import into the Homematic CCU (As SystemVariable)

Additional Utilities:
* A REST API for Healthcheck and MOnitoring is provided.

## REST API
### Healthcheck

#### HTTP Call
```
http://localhost:8080/
```
#### Result
```
{
  "health": "OK",
  "StartTime": "2023-10-20T07:06:02.732Z",
  "version": "0.9.0 (prod)",
  "CCU": {
    "Host": "192.168.10.5",
    "PollingIntervall": 300,
    "Device": {
      "LastUpdate": {
        "Updated": 98,
        "Timestamp": "2023-10-20T07:06:08.126Z"
      },
      "Devices": 99,
      "Channels": 495,
      "DataPoints": 778
    },
    "Variable": {
      "LastUpdate": {
        "Updated": 62,
        "Timestamp": "2023-10-20T07:06:02.784Z"
      },
      "Variables": 62
    }
  },
  "KM200": {
    "Enabled": false,
    "Host": "192.168.10.22",
    "PollingIntervall": 300,
    "LastUpdate": {
      "Updated": 0,
      "Timestamp": "2023-10-20T07:06:02.617Z"
    },
    "Variables": 0
  },
  "LevelJet": {
    "Enabled": false,
    "Interface": "/dev/ttyUSB0",
    "Export": {
      "Enabled": true,
      "File": "./data/leveljet.csv",
      "Interval": "hourly"
    },
    "LastUpdate": {
      "Updated": "2023-10-20T07:06:02.717Z",
      "Changed": "2023-10-20T07:06:02.717Z",
      "Failure": 0,
      "Fuel": 0
    }
  }
}
```
### List of Homematic Devices

#### HTTP Call
```
http://localhost:8080/data/device
```
#### Result
```
[
  {
    "name": "Fenster EG Flur",
    "iseId": "20796",
    "unreach": false,
    "stickyUnreach": false,
    "configPending": false,
    "address": "xxxx",
    "deviceType": "HMIP-SWDO",
    "channel": {}
  },
  {
    "name": "Fenster EG Kueche",
    "iseId": "6911",
    "unreach": false,
    "stickyUnreach": false,
    "configPending": false,
    "address": "xxxx",
    "deviceType": "HM-Sec-SCo",
    "channel": {}
  }
]
```

### List of Homematic Systemvariables

#### HTTP Call
```
http://localhost:8080/data/variable
```
#### Result
```
[
  {
    "name": "Alarmzone 1",
    "iseId": "1346",
    "value": false,
    "valueList": "",
    "valueType": 2,
    "timestamp": "1970-01-01T00:00:00.000Z"
  },
  {
    "name": "Anwesenheit",
    "iseId": "13893",
    "value": true,
    "valueList": "",
    "valueType": 2,
    "timestamp": "2023-10-19T16:21:07.000Z"
  }
]
```

# Getting Started
## Run as Docker Container
### Installation
#### Install hm-node-runner project
```
docker build -t homematic-node-runner .
docker-compose up -d
```
Alternative aufrufe & debugging hilfen
```
docker run -it -p 8080:8080 homematic-node-runner
docker run -it -p 8080:8080 homematic-node-runner ls -l /home/node/app

```
#### Setup docker-compose and environment 
```
version: "3.6"
services:
  node:
    container_name: homematic-node-runner
    image: "homematic-node-runner"
    user: "node"
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=prod
    volumes:
      - ./volumes/hm-node-runner/config:/home/node/app/config
      - ./volumes/hm-node-runner/data:/home/node/app/data
      - ./volumes/hm-node-runner/logs:/home/node/app/logs
    command: "npm start"
```
### Configuration
Copy config files to ./volumes/hm-node-runner/config

## Native installation
### Prerequisites
#### Install git
```
sudo apt-get update
sudo apt-get install git
```
#### Install node.js
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```
### Installation
#### Install hm-node-runner project
```
git clone https://github.com/jenszech/hm-node-runner.git
cd hm-node-runner
npm install
```
#### Setup an environment variable
In order to be able to use different configurations for each environment (Dev, Integ, Prod), the current environment must be set on the system.
To do this, an environment file must be created and a line inserted.
``` 
sudo vim /etc/environment 
```

```
NODE_ENV=prod
```
### Configuration 
```
vim ./config/prod.conf 
```

### Run in Background
Setup a background process with autostart
```
sudo npm install pm2@latest -g
pm2 start lib/hm-node-runner
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 list
pm2 save
```

## Configuration
Now you have to create the configuration
#### Configuration
The configuration is done via a central configuration file (PROJECT_ROOT / config / default.json).
It can be overwritten by local environment configurations (e.g. prod.json or dev.json).
All elements that are not overwritten are inherited from the default.json. The local file must have the same name as the name set in the environment (NODE_ENV = prod)

In the default configuration that is delivered with the project, no username, passwords or local server may be entered. Only general values should be included.
The environment configuration, on the other hand, contains all local adjustments including passwords. You should therefore not be checked into the github.

##### Default.json
```json
{
  "hm-node-runner": {
    "mainSetting": {
      "env": "default",
      "logLevel": "info"
    },
    "CCU": {
      "host": "<INSER YOUR IP>",
      "port": 80,
      "pollingIntervall": 60
    },
    "influx": {
      "host": "<INSERT YOUR IP>",
      "database": "smartdb",
      "measurement": "homematic"
    },
    "exportValues": [
      {
        "name": "<Homemtic Device Name>",
        "data": "TEMPERATURE",
        "dataName": "Temperatur",
        "area": "<GROUP NAME>"
      }
    ]
  }
}
```
##### prod.json
```json
{
  "hm-node-runner": {
    "mainSetting": {
      "env": "prod",
      "logLevel": "debug"
    },
    "CCU": {
      "host": "192.168.1.1"
    },
    "influx": {
      "host": "raspian",
      "database": "smarthomedb",
      "measurement": "homematic"
    },
    "exportValues": [
      {"name": "Sensor.Kueche",   "data": "TEMPERATURE",        "dataName": "Temperatur",     "area": "EG" },
      {"name": "Sensor.Kueche",   "data": "HUMIDITY",           "dataName": "Feuchtigkeit",   "area": "EG" },
      {"name": "Heizung.Bad",	  "data": "ACTUAL_TEMPERATURE", "dataName": "Temperatur",     "area": "OG" },
      {"name": "Heizung.Bad",	  "data": "SET_TEMPERATURE",    "dataName": "SollTemperatur", "area": "OG" },
      {"name": "Sensor.Einfahrt", "data": "MOTION",             "dataName": "Bewegung",       "area": "Garten" },
      {"name": "Sensor.Einfahrt", "data": "BRIGHTNESS",         "dataName": "Helligkeit",     "area": "Garten" }
    ]
  }
}

```
**name**: Is the name of the device in your homematic CCU<br>
**data**: Is Type of the datapoint in your device channel you want to export.<br>
**dataName**: Is a tag for the InfluxDB. The idea is to group devices by type<br>
**area**: Is a tag for the InfluxDB. The idea is to group devices by area (First Floor, Roof, Garden)<br> 


## Development and build pipeline
### Release a new version
```
npm version major|minor|patch
npm publish
```

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

