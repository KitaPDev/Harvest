import { Component, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../_services/dashboard/dashboard-grower.service';
import { LogSensorModuleLevel } from '../../../_models/logsensormodulelevel.model';
import { LogSensorRoom } from '../../../_models/logsensorroom.model';
import { LogSensorReservoir } from '../../../_models/logsensorreservoir.model';
import { Module } from '../../../_models/module.model';
import { Room } from '../../../_models/room.model';
import { Reservoir } from '../../../_models/reservoir.model';
import { interval, Subscription } from 'rxjs';
import { ModuleSettings } from '../../../_models/modulesettings.model';
import { ReservoirSettings } from '../../../_models/reservoirsettings.model';

@Component({
  selector: 'app-dashboard-grower',
  templateUrl: './dashboard-grower.component.html',
  styleUrls: ['./dashboard-grower.component.css'],
})
export class DashboardGrowerComponent implements OnInit {
  isDisplayCurrent: boolean = true;

  subRefreshSensor: Subscription;

  lsModule: Module[];
  lsReservoir: Reservoir[];
  lsRoom: Room[];
  lsLogSensorModuleLevel: LogSensorModuleLevel[];
  lsLogSensorReservoir: LogSensorReservoir[];
  lsLogSensorRoom: LogSensorRoom[];
  lsReservoirSettings: ReservoirSettings[];
  lsModuleSettings: ModuleSettings[];

  inHistoryMode: boolean = false;

  constructor(public dashboardGrowerService: DashboardGrowerService) {
    dashboardGrowerService.updateGrowerDashboardCurrent();
    dashboardGrowerService.lsModule.subscribe((lsModule) => {
      this.lsModule = lsModule;
    });
    dashboardGrowerService.lsReservoir.subscribe((lsReservoir) => {
      this.lsReservoir = lsReservoir;
    });
    dashboardGrowerService.lsRoom.subscribe((lsRoom) => {
      this.lsRoom = lsRoom;
    });
    dashboardGrowerService.lsLogSensorModuleLevel.subscribe(
      (lsLogSensorModuleLevel) => {
        this.lsLogSensorModuleLevel = lsLogSensorModuleLevel;
      }
    );
    dashboardGrowerService.lsLogSensorReservoir.subscribe(
      (lsLogSensorReservoir) => {
        this.lsLogSensorReservoir = lsLogSensorReservoir;
      }
    );
    dashboardGrowerService.lsLogSensorRoom.subscribe((lsLogSensorRoom) => {
      this.lsLogSensorRoom = lsLogSensorRoom;
    });

    dashboardGrowerService.lsModuleSettings.subscribe((lsModuleSettings) => {
      this.lsModuleSettings = lsModuleSettings;
    });
    dashboardGrowerService.lsReservoirSettings.subscribe(
      (lsReservoirSettings) => {
        this.lsReservoirSettings = lsReservoirSettings;
      }
    );
  }

  ngOnInit(): void {
    this.subRefreshSensor = interval(2000).subscribe(() => {
      if (!this.inHistoryMode) {
        this.dashboardGrowerService.getLatestGrowerSensorLogs();
      }
    });

    this.dashboardGrowerService.getAllReservoirSettings();
    this.dashboardGrowerService.getAllModuleSettings();
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
  }

  toggleDisplayMode(): void {
    this.isDisplayCurrent = !this.isDisplayCurrent;
  }

  getRoomTemperature(roomID: number): string {
    for (let logSensorRoom of this.lsLogSensorRoom) {
      if (logSensorRoom.roomID == roomID) {
        return logSensorRoom.temperature.toString();
      }
    }

    return 'N/A';
  }

  getRoomHumidity(roomID: number): string {
    for (let logSensorRoom of this.lsLogSensorRoom) {
      if (logSensorRoom.roomID == roomID) {
        return logSensorRoom.humidity.toString();
      }
    }

    return 'N/A';
  }

  getModuleTemperatureRoot(moduleID: number, level: number): string {
    for (let logSensorModuleLevel of this.lsLogSensorModuleLevel) {
      if (
        moduleID == logSensorModuleLevel.moduleID &&
        level == logSensorModuleLevel.level
      ) {
        return logSensorModuleLevel.temperatureRoot.toString();
      }
    }

    return 'N/A';
  }

  getModuleHumidityRoot(moduleID: number, level: number): string {
    for (let logSensorModuleLevel of this.lsLogSensorModuleLevel) {
      if (
        moduleID == logSensorModuleLevel.moduleID &&
        level == logSensorModuleLevel.level
      ) {
        return logSensorModuleLevel.humidityRoot.toString();
      }
    }

    return 'N/A';
  }

  getReservoirTds(reservoirID: number): string {
    for (let logSensorReservoir of this.lsLogSensorReservoir) {
      if (reservoirID == logSensorReservoir.reservoirID) {
        return logSensorReservoir.tds.toString();
      }
    }

    return 'N/A';
  }

  getReservoirPh(reservoirID: number): string {
    for (let logSensorReservoir of this.lsLogSensorReservoir) {
      if (reservoirID == logSensorReservoir.reservoirID) {
        return logSensorReservoir.ph.toString();
      }
    }

    return 'N/A';
  }

  getReservoirTemperatureSolution(reservoirID: number): string {
    for (let logSensorReservoir of this.lsLogSensorReservoir) {
      if (reservoirID == logSensorReservoir.reservoirID) {
        return logSensorReservoir.temperatureSolution.toString();
      }
    }

    return 'N/A';
  }

  getReservoirSolutionLevel(reservoirID: number): string {
    for (let logSensorReservoir of this.lsLogSensorReservoir) {
      if (reservoirID == logSensorReservoir.reservoirID) {
        return logSensorReservoir.solnLevel.toString();
      }
    }

    return 'N/A';
  }

  getLevelsArray(lvl: number) {
    let levels = [];

    for (let i = 0; i < lvl; i++) {
      levels.push(i + 1);
    }

    return levels;
  }

  onCLickSVNutrient(reservoirID: number) {}
}
