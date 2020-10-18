import { logger } from '../logger';
import { LevelData } from './LevelJetModel';

const SerialPort = require('serialport');
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
const { crc16 } = require('easy-crc');

declare type serialEventHandler = (level: LevelData) => void;
const MAX_COUNT_LENGTH = 60 * 60 * 24;

export class SerialListener {
  private serialInterface: string;
  private port: any = null;
  private parser: any = new InterByteTimeout({ interval: 30 });
  private countFailure = 0;
  private countSuccess = 0;
  public level: LevelData = new LevelData(null);
  public levelUpdateCallback: serialEventHandler;

  constructor(serialInterface: string, callback: serialEventHandler) {
    this.levelUpdateCallback = callback;
    this.serialInterface = serialInterface;
    this.port = this.initiatePort();
    this.port.pipe(this.parser);

    this.parser.on('data', (data: any) => {
      if (this.parseSerialDataBuffer(data)) {
        this.levelUpdateCallback(this.level);
      }
      return;
    });

    this.port.on('open', () => {
      logger.info('Connected to serial interface: ' + this.serialInterface);
    });

    this.port.on('close', () => {
      logger.info('Close serial interface: ' + this.serialInterface);
    });

    this.port.on('error', (err: any) => {
      logger.error(err);
    });
  }

  public startListener() {
    this.port.open();
  }

  public stopListener() {
    this.port.close((err: any) => {
      logger.error(err);
    });
  }

  private initiatePort(): any {
    return new SerialPort(
      this.serialInterface,
      {
        baudRate: 19200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        autoOpen: false,
      },
      (err: any) => {
        if (err) {
          return logger.error(err);
        }
      },
    );
  }

  private calcCheckSum(data: any): string {
    return crc16('BUYPASS', data.slice(0, 10)).toString(16);
  }

  private isValidDataPackage(data: any): boolean {
    const recCrc = data[11] * 256 + data[10];
    return recCrc.toString(16) === this.calcCheckSum(data);
  }

  private parseSerialDataBuffer(data: any): boolean {
    this.resetCounter();
    if (this.isValidDataPackage(data)) {
      this.countSuccess++;
      this.level.update(data);
      // logger.debug('Parser Distanz: ' + this.level.toString());
      return true;
    } else {
      this.countFailure++;
      // logger.debug('Checksum failure - ' + this.calcErrorRate().toFixed(2) + '%');
      return false;
    }
  }

  private resetCounter() {
    if (this.countFailure + this.countSuccess > MAX_COUNT_LENGTH) {
      this.countSuccess = 0;
      this.countFailure = 0;
    }
  }

  public calcErrorRate(): number {
    return (this.countFailure / (this.countSuccess + this.countFailure)) * 100.0;
  }
}

/*
Beschreibung:
Die serielle Schnittstelle dient zum Datenaustausch zwischen Leveljet und verschiedener
Applikationen. Die Übertragung erfolgt dabei über TTL-Pegel 0-5V und kann somit direkt mit
anderen Microcontrollern verbunden werden. Zur Datenübertragung an einen PC muß ein
Pegelwandler eingesetzt werden.

Schnittstellenparameter:
Die Geschwindigkeit beträgt 19200 Baud, 8 Bit, None-Parity, 1 Stop-Bit (19200,8,N,1), die
Datenübertragung erfolgt im Sekundentakt.

Datenformat:
Ein Datenblock umfasst 12 Bytes, davon 10 Datenbytes und zwei CRC-Bytes.

0 Gerätekennung Low-Byte $E8
1 Gerätekennung High-Byte $03
2 Distanz Low-Byte
3 Distanz High-Byte
4 Füllhöhe Low-Byte
5 Füllhöhe High-Byte
6 Liter Low-Byte
7 Liter High-Byte
8 Inhalt in Prozent
9 Zustand derAusgänge
10 Kontrollbyte Low-Byte
11 Kontrollbyte High-Byte
 */
