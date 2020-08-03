export class Plant {
  plantID: number;
  plantLabel: string;
  tdsHigh: number;
  tdsLow: number;
  phHigh: number;
  phLow: number;
  temperatureHigh: number;
  temperatureLow: number;
  lightsOffHour: number;
  lightsOnHour: number;
  mistingOffSecond: number;
  mistingOnSecond: number;

  constructor() {
    this.plantID = 0;
    this.plantLabel = '';
    this.tdsHigh = 0;
    this.tdsLow = 0;
    this.phHigh = 0;
    this.phLow = 0;
    this.temperatureHigh = 0;
    this.temperatureLow = 0;
    this.lightsOffHour = 0;
    this.lightsOnHour = 0;
    this.mistingOffSecond = 0;
    this.mistingOnSecond = 0;
  }
}
