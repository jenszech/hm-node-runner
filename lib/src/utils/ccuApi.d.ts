import { DeviceManager, SystemVariableManager } from 'homematic-js-xmlapi';
import * as core from 'express-serve-static-core';
export declare function initCcuApi(expressApp: core.Express): void;
export declare function getSysMgr(): SystemVariableManager;
export declare function getDeviceList(): void;
export declare function getCurrentVariables(): Promise<SystemVariableManager>;
export declare function getCurrentStates(): Promise<DeviceManager>;
export declare function setValuesList(valueMap: Map<string, number | boolean>): void;
