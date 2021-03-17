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

  modules: Module[];
  reservoirs: Reservoir[];
  rooms: Room[];
  logSensorModuleLevels: LogSensorModuleLevel[];
  logSensorReservoirs: LogSensorReservoir[];
  logSensorRooms: LogSensorRoom[];
  lsModuleSettings: ModuleSettings[];
  lsReservoirSettings: ReservoirSettings[];

  inHistoryMode: boolean = false;

  constructor(public dashboardGrowerService: DashboardGrowerService) {
    dashboardGrowerService.updateGrowerDashboardCurrent();
    dashboardGrowerService.modules.subscribe((modules) => {
      this.modules = modules;
    });
    dashboardGrowerService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;
    });
    dashboardGrowerService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
    dashboardGrowerService.logSensorModuleLevels.subscribe(
      (logSensorModuleLevels) => {
        this.logSensorModuleLevels = logSensorModuleLevels;
      }
    );
    dashboardGrowerService.logSensorReservoirs.subscribe(
      (logSensorReservoirs) => {
        this.logSensorReservoirs = logSensorReservoirs;
      }
    );
    dashboardGrowerService.logSensorRooms.subscribe((logSensorRooms) => {
      this.logSensorRooms = logSensorRooms;
    });
  }

  ngOnInit(): void {
    this.subRefreshSensor = interval(2000).subscribe(() => {
      if (!this.inHistoryMode) {
        this.dashboardGrowerService.getLatestGrowerSensorLogs();
      }
    });

    this.dashboardGrowerService
      .getAllModuleSettings()
      .then((lsModuleSettings) => {
        this.lsModuleSettings = lsModuleSettings;
      });
    this.dashboardGrowerService
      .getAllReservoirSettings()
      .then((lsReservoirSettings) => {
        this.lsReservoirSettings = lsReservoirSettings;
      });
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
  }

  toggleDisplayMode(): void {
    this.isDisplayCurrent = !this.isDisplayCurrent;
  }
}
