import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject } from 'rxjs';
import { Module } from '../../_models/module.model';
import { Reservoir } from '../../_models/reservoir.model';
import { Room } from '../../_models/room.model';
import { LogSensorModuleLevel } from '../../_models/logsensormodulelevel.model';
import { LogSensorReservoir } from '../../_models/logsensorreservoir.model';
import { LogSensorRoom } from '../../_models/logsensorroom.model';
import { ModuleSettings } from '../../_models/modulesettings.model';

const DASHBOARD_GROWER_CURRENT_API =
  'http://localhost:9090/dashboard/grower/current';
const DASHBOARD_GROWER_UPDATE_SENSOR_LOGS_API =
  'http://localhost:9090/dashboard/grower/sensor/latest';
const DASHBOARD_GROWER_HISTORY_API =
  'http://localhost:9090/dashboard/grower/history';
const DASHBOARD_UPDATE_MODULE_SETTINGS_API =
  'http://localhost:9090/dashboard/module/update';
const DASHBOARD_GET_ALL_MODULE_SETTINGS_API =
  'http://localhost:9090/dashboard/module';
const DASHBOARD_UPDATE_RESERVOIR_SETTINGS_API =
  'http://localhost:9090/dashboard/reservoir/update';
const DASHBOARD_GET_ALL_RESERVOIR_SETTINGS_API =
  'http://localhost:9090/dashboard/reservoir';

@Injectable({ providedIn: 'root' })
export class DashboardGrowerService {
  private modulesSource: BehaviorSubject<Module[]> = new BehaviorSubject<
    Module[]
  >([]);
  modules = this.modulesSource.asObservable();

  private reservoirsSource: BehaviorSubject<Reservoir[]> = new BehaviorSubject<
    Reservoir[]
  >([]);
  reservoirs = this.reservoirsSource.asObservable();

  private roomsSource: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(
    []
  );
  rooms = this.roomsSource.asObservable();

  private logSensorModuleLevelsSource: BehaviorSubject<
    LogSensorModuleLevel[]
  > = new BehaviorSubject<LogSensorModuleLevel[]>([]);
  logSensorModuleLevels = this.logSensorModuleLevelsSource.asObservable();

  private logSensorReservoirsSource: BehaviorSubject<
    LogSensorReservoir[]
  > = new BehaviorSubject<LogSensorReservoir[]>([]);
  logSensorReservoirs = this.logSensorReservoirsSource.asObservable();

  private logSensorRoomsSource: BehaviorSubject<
    LogSensorRoom[]
  > = new BehaviorSubject<LogSensorRoom[]>([]);
  logSensorRooms = this.logSensorRoomsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  fetchGrowerDashboardCurrentData(): Promise<any> {
    return this.httpClient
      .get<any>(DASHBOARD_GROWER_CURRENT_API, httpPostOptions)
      .toPromise();
  }

  updateGrowerDashboardCurrent() {
    this.fetchGrowerDashboardCurrentData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let modules: Module[] = [];
        for (let fetchedModule of fetchedData.modules) {
          let module = new Module();

          module.moduleID = fetchedModule['module_id'];
          module.moduleLabel = fetchedModule['module_label'];
          module.level = fetchedModule['level'];
          module.roomID = fetchedModule['room_id'];
          module.reservoirID = fetchedModule['reservoir_id'];

          if (module.moduleID !== 0) {
            modules.push(module);
          }
        }
        this.modulesSource.next(modules);

        let reservoirs: Reservoir[] = [];
        for (let fetchedReservoir of fetchedData.reservoirs) {
          let reservoir = new Reservoir();

          reservoir.reservoirID = fetchedReservoir['reservoir_id'];
          reservoir.reservoirLabel = fetchedReservoir['reservoir_label'];
          reservoir.nutrientIDs = fetchedReservoir['nutrient_ids'];

          if (reservoir.reservoirID !== 0) {
            reservoirs.push(reservoir);
          }
        }
        this.reservoirsSource.next(reservoirs);

        let rooms: Room[] = [];
        for (let fetchedRoom of fetchedData.rooms) {
          let room = new Room();

          room.roomID = fetchedRoom['room_id'];
          room.roomLabel = fetchedRoom['room_label'];

          if (room.roomID !== 0) {
            rooms.push(room);
          }
        }
        this.roomsSource.next(rooms);

        let logSensorModuleLevels: LogSensorModuleLevel[] = [];
        let logSensorReservoirs: LogSensorReservoir[] = [];
        let logSensorRooms: LogSensorRoom[] = [];

        for (let fetchedLogSensorModuleLevel of fetchedData.log_sensor_module_levels) {
          let logSensorModuleLevel = new LogSensorModuleLevel();

          logSensorModuleLevel.loggedAt =
            fetchedLogSensorModuleLevel['logged_at'];
          logSensorModuleLevel.moduleID =
            fetchedLogSensorModuleLevel['module_id'];
          logSensorModuleLevel.level = fetchedLogSensorModuleLevel['level'];
          logSensorModuleLevel.temperatureRoot =
            fetchedLogSensorModuleLevel['temperature_root'];
          logSensorModuleLevel.humidityRoot =
            fetchedLogSensorModuleLevel['humidity_root'];

          logSensorModuleLevels.push(logSensorModuleLevel);
        }
        this.logSensorModuleLevelsSource.next(logSensorModuleLevels);

        for (let fetchedLogSensorReservoir of fetchedData.log_sensor_reservoirs) {
          let logSensorReservoir = new LogSensorReservoir();

          logSensorReservoir.loggedAt = fetchedLogSensorReservoir['logged_at'];
          logSensorReservoir.reservoirID =
            fetchedLogSensorReservoir['reservoir_id'];
          logSensorReservoir.tds = fetchedLogSensorReservoir['tds'];
          logSensorReservoir.ph = fetchedLogSensorReservoir['ph'];
          logSensorReservoir.temperatureSolution =
            fetchedLogSensorReservoir['temperature_solution'];
          logSensorReservoir.solnLevel =
            fetchedLogSensorReservoir['soln_level'];

          logSensorReservoirs.push(logSensorReservoir);
        }
        this.logSensorReservoirsSource.next(logSensorReservoirs);

        for (let fetchedLogSensorRoom of fetchedData.log_sensor_rooms) {
          let logSensorRoom = new LogSensorRoom();

          logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
          logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
          logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
          logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

          logSensorRooms.push(logSensorRoom);
        }
        this.logSensorRoomsSource.next(logSensorRooms);
      }
    );
  }

  fetchLatestGrowerSensorLogs(): Promise<any> {
    return this.httpClient
      .get<any>(DASHBOARD_GROWER_UPDATE_SENSOR_LOGS_API, httpPostOptions)
      .toPromise();
  }

  getLatestGrowerSensorLogs() {
    this.fetchLatestGrowerSensorLogs().then((response: HttpResponse<any>) => {
      let fetchedData = JSON.parse(JSON.stringify(response.body));

      let logSensorModuleLevels: LogSensorModuleLevel[] = [];
      let logSensorReservoirs: LogSensorReservoir[] = [];
      let logSensorRooms: LogSensorRoom[] = [];

      for (let fetchedLogSensorModuleLevel of fetchedData.log_sensor_module_levels) {
        let logSensorModuleLevel = new LogSensorModuleLevel();

        logSensorModuleLevel.loggedAt =
          fetchedLogSensorModuleLevel['logged_at'];
        logSensorModuleLevel.moduleID =
          fetchedLogSensorModuleLevel['module_id'];
        logSensorModuleLevel.level = fetchedLogSensorModuleLevel['level'];
        logSensorModuleLevel.temperatureRoot =
          fetchedLogSensorModuleLevel['temperature_root'];
        logSensorModuleLevel.humidityRoot =
          fetchedLogSensorModuleLevel['humidity_root'];

        logSensorModuleLevels.push(logSensorModuleLevel);
      }
      this.logSensorModuleLevelsSource.next(logSensorModuleLevels);

      for (let fetchedLogSensorReservoir of fetchedData.log_sensor_reservoirs) {
        let logSensorReservoir = new LogSensorReservoir();

        logSensorReservoir.loggedAt = fetchedLogSensorReservoir['logged_at'];
        logSensorReservoir.reservoirID =
          fetchedLogSensorReservoir['reservoir_id'];
        logSensorReservoir.tds = fetchedLogSensorReservoir['tds'];
        logSensorReservoir.ph = fetchedLogSensorReservoir['ph'];
        logSensorReservoir.temperatureSolution =
          fetchedLogSensorReservoir['temperature_solution'];
        logSensorReservoir.solnLevel = fetchedLogSensorReservoir['soln_level'];

        logSensorReservoirs.push(logSensorReservoir);
      }
      this.logSensorReservoirsSource.next(logSensorReservoirs);

      for (let fetchedLogSensorRoom of fetchedData.log_sensor_rooms) {
        let logSensorRoom = new LogSensorRoom();

        logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
        logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
        logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
        logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

        logSensorRooms.push(logSensorRoom);
      }
      this.logSensorRoomsSource.next(logSensorRooms);
    });
  }

  fetchGrowerDashboardHistoryData(
    timeStampBegin: Date,
    timeStampEnd: Date
  ): Promise<any> {
    const body = {
      time_stamp_begin: timeStampBegin,
      time_stamp_end: timeStampEnd,
    };

    return this.httpClient
      .post<any>(DASHBOARD_GROWER_HISTORY_API, body, httpPostOptions)
      .toPromise();
  }

  updateGrowerDashboardHistory(timeStampBegin: Date, timeStampEnd: Date) {
    this.fetchGrowerDashboardHistoryData(timeStampBegin, timeStampEnd).then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let logSensorModuleLevels: LogSensorModuleLevel[] = [];
        let logSensorReservoirs: LogSensorReservoir[] = [];
        let logSensorRooms: LogSensorRoom[] = [];

        for (let fetchedLogSensorModuleLevel of fetchedData.log_sensor_module_levels) {
          let logSensorModuleLevel = new LogSensorModuleLevel();

          logSensorModuleLevel.loggedAt =
            fetchedLogSensorModuleLevel['logged_at'];
          logSensorModuleLevel.moduleID =
            fetchedLogSensorModuleLevel['module_id'];
          logSensorModuleLevel.level = fetchedLogSensorModuleLevel['level'];
          logSensorModuleLevel.temperatureRoot =
            fetchedLogSensorModuleLevel['temperature_root'];
          logSensorModuleLevel.humidityRoot =
            fetchedLogSensorModuleLevel['humidity_root'];

          logSensorModuleLevels.push(logSensorModuleLevel);
        }
        this.logSensorModuleLevelsSource.next(logSensorModuleLevels);

        for (let fetchedLogSensorReservoir of fetchedData.log_sensor_reservoirs) {
          let logSensorReservoir = new LogSensorReservoir();

          logSensorReservoir.loggedAt = fetchedLogSensorReservoir['logged_at'];
          logSensorReservoir.reservoirID =
            fetchedLogSensorReservoir['reservoir_id'];
          logSensorReservoir.tds = fetchedLogSensorReservoir['tds'];
          logSensorReservoir.ph = fetchedLogSensorReservoir['ph'];
          logSensorReservoir.temperatureSolution =
            fetchedLogSensorReservoir['temperature_solution'];
          logSensorReservoir.solnLevel =
            fetchedLogSensorReservoir['soln_level'];

          logSensorReservoirs.push(logSensorReservoir);
        }
        this.logSensorReservoirsSource.next(logSensorReservoirs);

        for (let fetchedLogSensorRoom of fetchedData.log_sensor_rooms) {
          let logSensorRoom = new LogSensorRoom();

          logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
          logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
          logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
          logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

          logSensorRooms.push(logSensorRoom);
        }
        this.logSensorRoomsSource.next(logSensorRooms);
      }
    );
  }

  updateModuleSettings(moduleSettings: ModuleSettings) {
    this.httpClient
      .post<any>(DASHBOARD_GROWER_HISTORY_API, moduleSettings, httpPostOptions)
      .subscribe((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));
      });
  }

  getModules(): Module[] {
    return this.modulesSource.getValue();
  }

  getReservoirs(): Reservoir[] {
    return this.reservoirsSource.getValue();
  }

  getRooms(): Room[] {
    return this.roomsSource.getValue();
  }

  getLogSensorModuleLevels(): LogSensorModuleLevel[] {
    return this.logSensorModuleLevelsSource.getValue();
  }

  getLogSensorReservoirs(): LogSensorReservoir[] {
    return this.logSensorReservoirsSource.getValue();
  }

  getLogSensorRooms(): LogSensorRoom[] {
    return this.logSensorRoomsSource.getValue();
  }
}
