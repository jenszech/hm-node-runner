'use strict';

export class Status {
  public serviceStart: Date = new Date();
  public lastDeviceUpdateCount = 0;
  public lastDeviceUpdateTime: Date = new Date();
  public deviceCount: number = 0;
  public channelCount: number = 0;
  public datapointCount: number = 0;

  public getJson() : object{
    return {
      "health": "OK",
      "StartTime": this.serviceStart,
      "Device": {
        "LastUpdate": {
          "Updated": this.lastDeviceUpdateCount,
          "Timestamp": this.lastDeviceUpdateTime
        },
        "Devices": this.deviceCount,
        "Channels": this.channelCount,
        "Datapoints": this.datapointCount
      }
    }
  }
}
