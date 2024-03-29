export class ModuleSettings {
  moduleID: number;
  isAuto: number;
  lightsOnHour: number;
  lightsOffHour: number;
  humidityRootLow: number;
  humidityRootHigh: number;
  led1: number;
  led2: number;
  fan1: number;
  fan2: number;
  sv1: number;
  sv2: number;

  constructor() {
    this.moduleID = 0;
    this.isAuto = 0;
    this.lightsOnHour = 0;
    this.lightsOffHour = 0;
    this.humidityRootLow = 0;
    this.humidityRootHigh = 0;
    this.led1 = 0;
    this.led2 = 0;
    this.fan1 = 0;
    this.fan2 = 0;
    this.sv1 = 0;
    this.sv2 = 0;
  }
}
