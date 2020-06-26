import { Device } from "homematic-js-xmlapi";

class DeviceManager  {
    public deviceMap:Map<string, Device> = new Map();

    public updateCallback = (deviceList: Array<Device>):void => {
        this.updateDevices(deviceList);
    }

    public printDeviceList() {
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

    private updateDevices(deviceList: Array<Device>) {
        console.log("... UpdateList")
        for (let device of deviceList) {
            if (this.deviceMap.has(device.iseId)) {
                device.updateValues(device);
            } else {
                this.deviceMap.set(device.iseId, device);
            }
        }
    }
}
export default DeviceManager;
