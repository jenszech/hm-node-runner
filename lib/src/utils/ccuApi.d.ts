import { DeviceManager, SystemVariableManager } from 'homematic-js-xmlapi';
export declare function getDeviceList(): void;
export declare function getCurrentVariables(): Promise<SystemVariableManager>;
export declare function getCurrentStates(): Promise<DeviceManager>;
export declare function setValuesList(valueMap: Map<string, number | boolean>): void;