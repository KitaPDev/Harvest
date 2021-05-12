export class ReservoirSettings {
  reservoirID: number;
  tdsLow: number;
  tdsHigh: number;
  phLow: number;
  phHigh: number;
  svWater: number;
  svNutrient: number;

  constructor() {
    this.reservoirID = 0;
    this.tdsLow = 0;
    this.tdsHigh = 0;
    this.phLow = 0;
    this.phHigh = 0;
    this.svWater = 0;
    this.svNutrient = 0;
  }
}
