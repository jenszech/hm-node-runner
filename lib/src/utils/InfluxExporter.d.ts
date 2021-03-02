import { DeviceManager, SystemVariableManager, SystemVariable } from 'homematic-js-xmlapi';
export declare function exportValues(devMgr: DeviceManager): void;
export declare function exportAllVariables(sysMgr: SystemVariableManager): void;
export declare function exportMeasurement(measure: any, sysMgr: SystemVariableManager): void;
export declare function exportVariable(measure: any, sysVar: SystemVariable | null): void;
export declare function getMeasureFromConfig(name: string): any;
