# hm-node-runner
A homematic nodejs script runner.

## Getting Started
### Prerequisites
#### Install git
```
sudo apt-get update
sudo apt-get install git
```
#### Install node.js
```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
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
      "env": "dev",
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
#### Run in Background
Setup a background process with autostart
```
sudo npm install pm2@latest -g
pm2 start lib/hm-node-runner
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 list
pm2 save
```

## Development and build pipeline
### Release a new version
```
npm version major|minor|patch
npm publish
```

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
