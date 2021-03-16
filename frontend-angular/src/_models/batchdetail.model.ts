import { LogSensorModuleLevel } from './logsensormodulelevel.model';
import { LogSensorReservoir } from './logsensorreservoir.model';
import { LogSensorRoom } from './logsensorroom.model';

export class BatchDetail {
  logSensorModuleLevels: LogSensorModuleLevel[];
  logSensorReservoirs: LogSensorReservoir[];
  logSensorRooms: LogSensorRoom[];
}
