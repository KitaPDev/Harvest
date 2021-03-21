import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject, Observable } from 'rxjs';
import { Module } from '../../_models/module.model';
import { Reservoir } from '../../_models/reservoir.model';
import { Room } from '../../_models/room.model';
import { LogSensorModuleLevel } from '../../_models/logsensormodulelevel.model';
import { LogSensorReservoir } from '../../_models/logsensorreservoir.model';
import { LogSensorRoom } from '../../_models/logsensorroom.model';
import { ModuleSettings } from '../../_models/modulesettings.model';
import { ReservoirSettings } from '../../_models/reservoirsettings.model';

const DASHBOARD_GROWER_CURRENT_API =
  'http://localhost:9090/dashboard/grower/current';
const DASHBOARD_GROWER_UPDATE_SENSOR_LOGS_API =
  'http://localhost:9090/dashboard/grower/sensor/latest';
const DASHBOARD_GROWER_HISTORY_API =
  'http://localhost:9090/dashboard/grower/history';
const DASHBOARD_UPDATE_MODULE_SETTINGS_API =
  'http://localhost:9090/dashboard/module/update';
const DASHBOARD_GET_ALL_MODULE_SETTINGS_API =
  'http://localhost:9090/dashboard/module/all';
const DASHBOARD_UPDATE_RESERVOIR_SETTINGS_API =
  'http://localhost:9090/dashboard/reservoir/update';
const DASHBOARD_GET_ALL_RESERVOIR_SETTINGS_API =
  'http://localhost:9090/dashboard/reservoir/all';

@Injectable({ providedIn: 'root' })
export class DashboardGrowerService {
  private lsModuleSource: BehaviorSubject<Module[]> = new BehaviorSubject<
    Module[]
  >([]);
  lsModule = this.lsModuleSource.asObservable();

  private lsReservoirSource: BehaviorSubject<Reservoir[]> = new BehaviorSubject<
    Reservoir[]
  >([]);
  lsReservoir = this.lsReservoirSource.asObservable();

  private lsRoomSource: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(
    []
  );
  lsRoom = this.lsRoomSource.asObservable();

  private lsLogSensorModuleLevelSource: BehaviorSubject<
    LogSensorModuleLevel[]
  > = new BehaviorSubject<LogSensorModuleLevel[]>([]);
  lsLogSensorModuleLevel = this.lsLogSensorModuleLevelSource.asObservable();

  private lsLogSensorReservoirSource: BehaviorSubject<
    LogSensorReservoir[]
  > = new BehaviorSubject<LogSensorReservoir[]>([]);
  lsLogSensorReservoir = this.lsLogSensorReservoirSource.asObservable();

  private lsLogSensorRoomSource: BehaviorSubject<
    LogSensorRoom[]
  > = new BehaviorSubject<LogSensorRoom[]>([]);
  lsLogSensorRoom = this.lsLogSensorRoomSource.asObservable();

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
        for (let fetchedModule of fetchedData.ls_module) {
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
        this.lsModuleSource.next(modules);

        let reservoirs: Reservoir[] = [];
        for (let fetchedReservoir of fetchedData.ls_reservoir) {
          let reservoir = new Reservoir();

          reservoir.reservoirID = fetchedReservoir['reservoir_id'];
          reservoir.reservoirLabel = fetchedReservoir['reservoir_label'];
          reservoir.nutrientIDs = fetchedReservoir['nutrient_ids'];

          if (reservoir.reservoirID !== 0) {
            reservoirs.push(reservoir);
          }
        }
        this.lsReservoirSource.next(reservoirs);

        let rooms: Room[] = [];
        for (let fetchedRoom of fetchedData.ls_room) {
          let room = new Room();

          room.roomID = fetchedRoom['room_id'];
          room.roomLabel = fetchedRoom['room_label'];

          if (room.roomID !== 0) {
            rooms.push(room);
          }
        }
        this.lsRoomSource.next(rooms);

        let lsLogSensorModuleLevel: LogSensorModuleLevel[] = [];
        let lsLogSensorReservoir: LogSensorReservoir[] = [];
        let lsLogSensorRoom: LogSensorRoom[] = [];

        for (let fetchedLogSensorModuleLevel of fetchedData.ls_log_sensor_module_level) {
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

          lsLogSensorModuleLevel.push(logSensorModuleLevel);
        }
        this.lsLogSensorModuleLevelSource.next(lsLogSensorModuleLevel);

        for (let fetchedLogSensorReservoir of fetchedData.ls_log_sensor_reservoir) {
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

          lsLogSensorReservoir.push(logSensorReservoir);
        }
        this.lsLogSensorReservoirSource.next(lsLogSensorReservoir);

        for (let fetchedLogSensorRoom of fetchedData.ls_log_sensor_room) {
          let logSensorRoom = new LogSensorRoom();

          logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
          logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
          logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
          logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

          lsLogSensorRoom.push(logSensorRoom);
        }
        this.lsLogSensorRoomSource.next(lsLogSensorRoom);
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

      for (let fetchedLogSensorModuleLevel of fetchedData.ls_log_sensor_module_level) {
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
      this.lsLogSensorModuleLevelSource.next(logSensorModuleLevels);

      for (let fetchedLogSensorReservoir of fetchedData.ls_log_sensor_reservoir) {
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
      this.lsLogSensorReservoirSource.next(logSensorReservoirs);

      for (let fetchedLogSensorRoom of fetchedData.ls_log_sensor_room) {
        let logSensorRoom = new LogSensorRoom();

        logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
        logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
        logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
        logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

        logSensorRooms.push(logSensorRoom);
      }
      this.lsLogSensorRoomSource.next(logSensorRooms);
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

        let lsLogSensorModuleLevel: LogSensorModuleLevel[] = [];
        let lsLogSensorReservoir: LogSensorReservoir[] = [];
        let lsLogSensorRoom: LogSensorRoom[] = [];

        for (let fetchedLogSensorModuleLevel of fetchedData.ls_log_sensor_module_level) {
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

          lsLogSensorModuleLevel.push(logSensorModuleLevel);
        }
        this.lsLogSensorModuleLevelSource.next(lsLogSensorModuleLevel);

        for (let fetchedLogSensorReservoir of fetchedData.ls_log_sensor_reservoir) {
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

          lsLogSensorReservoir.push(logSensorReservoir);
        }
        this.lsLogSensorReservoirSource.next(lsLogSensorReservoir);

        for (let fetchedLogSensorRoom of fetchedData.ls_log_sensor_room) {
          let logSensorRoom = new LogSensorRoom();

          logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
          logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
          logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
          logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

          lsLogSensorRoom.push(logSensorRoom);
        }
        this.lsLogSensorRoomSource.next(lsLogSensorRoom);
      }
    );
  }

  async updateModuleSettings(moduleSettings: ModuleSettings): Promise<boolean> {
    let receivedModuleSettings: ModuleSettings = new ModuleSettings();

    await this.httpClient
      .post<any>(
        DASHBOARD_UPDATE_MODULE_SETTINGS_API,
        moduleSettings,
        httpPostOptions
      )
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));
        let fetchedModuleSettings = fetchedData.module_settings;

        receivedModuleSettings.moduleID = fetchedModuleSettings['module_id'];
        receivedModuleSettings.isAuto = fetchedModuleSettings['is_auto'];
        receivedModuleSettings.lightOnTime =
          fetchedModuleSettings['light_on_time'];
        receivedModuleSettings.lightOffTime =
          fetchedModuleSettings['light_off_time'];
        receivedModuleSettings.humidityRootLow =
          fetchedModuleSettings['humidity_root_low'];
        receivedModuleSettings.humidityRootHigh =
          fetchedModuleSettings['humidity_root_high'];
        receivedModuleSettings.led1 = fetchedModuleSettings['led_1'];
        receivedModuleSettings.led2 = fetchedModuleSettings['led_2'];
        receivedModuleSettings.fan1 = fetchedModuleSettings['fan_1'];
        receivedModuleSettings.fan2 = fetchedModuleSettings['fan_2'];
        receivedModuleSettings.sv1 = fetchedModuleSettings['sv_1'];
        receivedModuleSettings.sv2 = fetchedModuleSettings['sv_2'];
      });

    return (
      JSON.stringify(moduleSettings) == JSON.stringify(receivedModuleSettings)
    );
  }

  async getAllModuleSettings(): Promise<ModuleSettings[]> {
    let receivedLsModuleSettings: ModuleSettings[] = [];

    await this.httpClient
      .get(DASHBOARD_GET_ALL_MODULE_SETTINGS_API, httpGetOptions)
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        if (fetchedData.ls_module_settings != undefined) {
          for (let moduleSettings of fetchedData.ls_module_settings) {
            receivedLsModuleSettings.push(moduleSettings);
          }
        }
      });

    return receivedLsModuleSettings;
  }

  async updateReservoirSettings(
    reservoirSettings: ReservoirSettings
  ): Promise<boolean> {
    let receivedReservoirSettings: ReservoirSettings = new ReservoirSettings();

    await this.httpClient
      .post<any>(
        DASHBOARD_UPDATE_RESERVOIR_SETTINGS_API,
        reservoirSettings,
        httpPostOptions
      )
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));
        let fetchedReservoirSettings = fetchedData.reservoir_settings;

        receivedReservoirSettings.reservoirID =
          fetchedReservoirSettings['reservoir_id'];
        receivedReservoirSettings.isAuto = fetchedReservoirSettings['is_auto'];
        receivedReservoirSettings.tdsLow = fetchedReservoirSettings['tds_low'];
        receivedReservoirSettings.tdsHigh =
          fetchedReservoirSettings['tds_high'];
        receivedReservoirSettings.phLow = fetchedReservoirSettings['ph_low'];
        receivedReservoirSettings.phHigh = fetchedReservoirSettings['ph_high'];
        receivedReservoirSettings.svWater =
          fetchedReservoirSettings['sv_water'];
        receivedReservoirSettings.svReservoir =
          fetchedReservoirSettings['sv_reservoir'];
      });

    return (
      JSON.stringify(reservoirSettings) ==
      JSON.stringify(receivedReservoirSettings)
    );
  }

  async getAllReservoirSettings(): Promise<ReservoirSettings[]> {
    let receivedLsReservoirSettings: ReservoirSettings[] = [];

    await this.httpClient
      .get(DASHBOARD_GET_ALL_RESERVOIR_SETTINGS_API, httpGetOptions)
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        if (fetchedData.ls_reservoir_settings != undefined) {
          for (let reservoirSettings of fetchedData.ls_reservoir_settings) {
            receivedLsReservoirSettings.push(reservoirSettings);
          }
        }
      });

    return receivedLsReservoirSettings;
  }

  getModules(): Module[] {
    return this.lsModuleSource.getValue();
  }

  getReservoirs(): Reservoir[] {
    return this.lsReservoirSource.getValue();
  }

  getRooms(): Room[] {
    return this.lsRoomSource.getValue();
  }

  getLogSensorModuleLevels(): LogSensorModuleLevel[] {
    return this.lsLogSensorModuleLevelSource.getValue();
  }

  getLogSensorReservoirs(): LogSensorReservoir[] {
    return this.lsLogSensorReservoirSource.getValue();
  }

  getLogSensorRooms(): LogSensorRoom[] {
    return this.lsLogSensorRoomSource.getValue();
  }
}
