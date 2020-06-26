"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceManager {
    constructor() {
        this.deviceMap = new Map();
        this.updateCallback = (deviceList) => {
            this.updateDevices(deviceList);
        };
    }
    printDeviceList() {
        for (let device of this.deviceMap.values()) {
            console.log(device.toString());
            for (let channel of device.channel.values()) {
                console.log("  " + channel.toString());
                for (let datapoint of channel.dataPoint.values()) {
                    console.log("   " + datapoint.toString());
                }
            }
        }
    }
    updateDevices(deviceList) {
        console.log("... UpdateList");
        for (let device of deviceList) {
            if (this.deviceMap.has(device.iseId)) {
                device.updateValues(device);
            }
            else {
                this.deviceMap.set(device.iseId, device);
            }
        }
    }
}
exports.default = DeviceManager;
//# sourceMappingURL=DeviceManager.js.map