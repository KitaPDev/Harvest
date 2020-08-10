export class Module {
  moduleID: number;
  reservoirID: number;
  roomID: number;
  moduleLabel: string
  level: number

  constructor() {
    this.moduleID = 0;
    this.reservoirID = 0;
    this.roomID = 0;
    this.moduleLabel = '';
    this.level = 0;
  }
}
