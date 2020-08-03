export class Nutrient {
  nutrientID: number;
  nutrientLabel: string;
  part: number;
  nutrientType: number;
  ccPerLiter: number;
  n: number
  p: number
  k: number

  constructor() {
    this.nutrientID = 0;
    this.nutrientLabel = '';
    this.part = 0;
    this.nutrientType = 0;
    this.ccPerLiter = 0;
    this.n = 0;
    this.p = 0;
    this.k = 0;
  }
}
