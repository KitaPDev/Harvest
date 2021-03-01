export class Module {
  moduleID: number;
  isAuto: number;
  isWaterOnly: number;
  lightOnTime: number;
  lightOffTime: number;
  humidityRootLow: number;
  humidityRootHigh: number;

  constructor() {
    this.moduleID = 0;
    this.isAuto = 0;
    this.isWaterOnly = 0;
    this.lightOnTime = 0;
    this.lightOffTime = 0;
    this.humidityRootLow = 0;
    this.humidityRootHigh = 0;
  }
}
