export class ReservoirSettings {
  reservoirID: number;
  isAuto: number;
  tdsLow: number;
  tdsHigh: number;
  phLow: number;
  phHigh: number;
  svWater: number;
  svReservoir: number;

  constructor() {
    this.reservoirID = 0;
    this.isAuto = 0;
    this.tdsLow = 0;
    this.tdsHigh = 0;
    this.phLow = 0;
    this.phHigh = 0;
    this.svWater = 0;
    this.svReservoir = 0;
  }
}
