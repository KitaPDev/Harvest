export class GerminatorSettings {
  isAuto: number;
  humidityLow: number;
  humidityHigh: number;
  lightOnTime: number;
  lightOffTime: number;
  pump: number;
  led: number;

  constructor() {
    this.isAuto = 0;
    this.humidityLow = 0;
    this.humidityHigh = 0;
    this.lightOnTime = 0;
    this.lightOffTime = 0;
    this.pump = 0;
    this.led = 0;
  }
}
