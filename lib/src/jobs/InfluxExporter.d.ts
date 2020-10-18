import { DeviceManager, SystemVariableManager } from 'homematic-js-xmlapi';
export declare function exportValues(devMgr: DeviceManager): void;
export declare function exportVariables(sysMgr: SystemVariableManager): void;
export declare function exportVariable(measure: any, sysMgr: SystemVariableManager): void;
export declare function getMeasureFromConfig(name: string): any;
