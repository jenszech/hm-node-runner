import { DeviceStatistic } from 'homematic-js-xmlapi';
export declare class Status {
  serviceStart: Date;
  deviceStats: DeviceStatistic;
  getJson(): object;
}
