export class Batch {
  batchID: number;
  batchLabel: string;
  moduleIDs: number[];
  reservoirIDs: number[];
  roomIDs: number[];
  plantID: number;
  nutrientIDs: number[];
  timeStampBegin: Date;
  timeStampEnd: Date;
  weight: number;
  lightsOnHour: number;
  lightsOffHour: number;
  mistingOnSecond: number;
  mistingOffSecond: number;
  remarks: string;
}
