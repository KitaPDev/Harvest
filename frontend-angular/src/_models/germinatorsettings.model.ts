export class GerminatorSettings {
  isAuto: number;
  humidityLow: number;
  humidityHigh: number;
  lightsOnHour: number;
  lightsOffHour: number;
  pump: number;
  led: number;

  constructor() {
    this.isAuto = 0;
    this.humidityLow = 0;
    this.humidityHigh = 0;
    this.lightsOnHour = 0;
    this.lightsOffHour = 0;
    this.pump = 0;
    this.led = 0;
  }
}
