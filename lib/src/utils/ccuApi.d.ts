import { DeviceManager, SystemVariableManager, SystemVariable } from 'homematic-js-xmlapi';
export declare function getSysMgr(): SystemVariableManager;
export declare function getDevMgr(): DeviceManager;
export declare function getDeviceList(): void;
export declare function getCurrentVariables(): Promise<SystemVariableManager>;
export declare function getCurrentStates(): Promise<DeviceManager>;
export declare function setValuesList(valueMap: Map<string, number | boolean>): void;
export declare function setValue(valuename: string, value: number | boolean): void;
export declare function setValueToSysVar(
  sysvar: SystemVariable | null,
  value: number | boolean,
): void;
