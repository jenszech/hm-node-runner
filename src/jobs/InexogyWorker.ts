import axios from 'axios'; // Für HTTP-Anfragen
import { logger } from '../logger';
import { Status } from '../routes/healthcheck/Status';

const config = require('config');
const myConfig = config.get('hm-node-runner');

export class InexogyWorker {
  private status: Status;

  constructor(status: Status) {
    this.status = status;
  }

  public init() {
    logger.info('Collect EnergyConsumption from Inoxegy');
    this.updateCurrentStates();
  }

  public startPolling() {
    this.updateCurrentStates();
    setInterval(
      () => this.updateCurrentStates(),
      myConfig.jobs.InexogyImport.pollingIntervall * 1000,
    );
  }

  // -- private functions ----------------------------------------------
  private async updateCurrentStates() {
    logger.debug('Start updating Inexogy values');

    try {
      // API-Endpunkt und Authentifizierung
      const meterId = 'e31c41bd59334eb5800155a5a007e230';
      const apiUrl = `${myConfig.jobs.InexogyImport.apiUrl}/last_reading?meterId=${meterId}`;

      // HTTP GET-Anfrage an die API
      const response = await axios.get(apiUrl, {
        auth: {
          username: myConfig.jobs.InexogyImport.username,
          password: myConfig.jobs.InexogyImport.password,
        },
      });

      // Daten aus der API-Antwort extrahieren
      const data = response.data.values;

      // Werte berechnen und loggen
      const energyConsumption = data.energy1 / 10000000000; // kWh
      const energyFeedIn = data.energyOut1   / 10000000000; // kWh
      const currentPower = data.power / 1000; // kW

      console.log(`Inexogy Verbrauch: ${energyConsumption} kWh`);
      console.log(`Inexogy Einspeisung: ${energyFeedIn} kWh`);
      console.log(`Inexogy Power: ${currentPower} kW`);

      // Speichere die Daten in der CCU oder exportiere sie
      //setValueToSysVar('Inexogy_EnergyConsumption', energyConsumption);
      //setValueToSysVar('Inexogy_EnergyFeedIn', energyFeedIn);
      //setValueToSysVar('Inexogy_CurrentPower', currentPower);

      //exportVariable('Inexogy_EnergyConsumption', energyConsumption);
      //exportVariable('Inexogy_EnergyFeedIn', energyFeedIn);
      //exportVariable('Inexogy_CurrentPower', currentPower);

      // Status aktualisieren
      //this.status.set('InexogyWorker', 'OK');
    } catch (error) {
      logger.error('Failed to update Inexogy values:', error);
      //this.status.set('InexogyWorker', 'ERROR');
    }
  }
}
