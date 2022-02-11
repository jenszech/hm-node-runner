export declare const km200Statistic: {
    lastUpdateCount: number;
    lastUpdateTime: Date;
    variableCount: number;
};
export declare function getKm200Value(api: string): Promise<number | string | boolean>;
export declare function getKm200Values(): Promise<Map<string, number | boolean>>;
