/// <reference types="node" />
export declare class LevelData {
  constructor(data: any);
  device: number;
  distanz: number;
  fheight: number;
  fvol: number;
  pct: number;
  crc: number;
  lastUpdateTime: Date;
  update(data: Buffer | LevelData): void;
  private updateByBuffer;
  copy(data: LevelData): void;
  toString(): string;
  toLogString(): string;
  private getNiceLastUpdatedTime;
}
