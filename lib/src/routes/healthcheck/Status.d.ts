import { DeviceStatistic, VariableStatistic } from 'homematic-js-xmlapi';
export declare class Status {
  serviceStart: Date;
  deviceStats: DeviceStatistic;
  variableStats: VariableStatistic;
  getJson(): object;
}
