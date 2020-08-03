export class Reservoir {
  reservoirID: number;
  reservoirLabel: string;
  nutrientIDs: number[];

  constructor() {
    this.reservoirID = 0;
    this.reservoirLabel = '';
    this.nutrientIDs = [];
  }
}
