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
import { cloneDeep } from 'lodash';
import { GerminatorSettings } from '../../../_models/germinatorsettings.model';
import { HttpResponse } from '@angular/common/http';

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

  getSvNutrientStatus(reservoirID: number) {
    let index = this.lsReservoirSettings.findIndex(
      (rs) => rs.reservoirID == reservoirID
    );
    return this.lsReservoirSettings[index].svNutrient;
  }

  getSvWaterStatus(reservoirID: number) {
    let index = this.lsReservoirSettings.findIndex(
      (rs) => rs.reservoirID == reservoirID
    );
    return this.lsReservoirSettings[index].svWater;
  }

  onCLickSvNutrient(reservoirID: number) {
    for (let reservoirSettings of this.lsReservoirSettings) {
      if (reservoirSettings.reservoirID == reservoirID) {
        let tmpReservoirSettings = cloneDeep(reservoirSettings);

        tmpReservoirSettings = tmpReservoirSettings.svNutrient == 1 ? 0 : 1;

        this.dashboardGrowerService
          .updateReservoirSettings(tmpReservoirSettings)
          .then((success) => {
            if (!success) {
              alert('Failed to toggle SV Nutrient.');
            }
          });
      }
    }
  }

  onCLickSvWater(reservoirID: number) {
    for (let reservoirSettings of this.lsReservoirSettings) {
      if (reservoirSettings.reservoirID == reservoirID) {
        let tmpReservoirSettings = cloneDeep(reservoirSettings);

        tmpReservoirSettings = tmpReservoirSettings.svWater == 1 ? 0 : 1;

        this.dashboardGrowerService
          .updateReservoirSettings(tmpReservoirSettings)
          .then((success) => {
            if (!success) {
              alert('Failed to toggle SV Water.');
            }
          });
      }
    }
  }

  onClickFan(moduleID: number, level: number) {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        let tmpModuleSettings = cloneDeep(moduleSettings);

        switch (level) {
          case 1:
            tmpModuleSettings.fan1 = tmpModuleSettings.fan1 == 1 ? 0 : 1;
            break;

          case 2:
            tmpModuleSettings.fan2 = tmpModuleSettings.fan2 == 1 ? 0 : 1;
        }

        this.dashboardGrowerService
          .updateModuleSettings(tmpModuleSettings)
          .then((success) => {
            if (!success) {
              alert('Failed to toggle Fan for Level ' + level + '.');
            }
          });
      }
    }
  }

  onClickLed(moduleID: number, level: number) {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        let tmpModuleSettings = cloneDeep(moduleSettings);

        switch (level) {
          case 1:
            tmpModuleSettings.led1 = tmpModuleSettings.led1 == 1 ? 0 : 1;
            break;

          case 2:
            tmpModuleSettings.led2 = tmpModuleSettings.led2 == 1 ? 0 : 1;
        }

        this.dashboardGrowerService
          .updateModuleSettings(tmpModuleSettings)
          .then((success) => {
            if (!success) {
              alert('Failed to toggle LED for Level ' + level + '.');
            }
          });
      }
    }
  }

  // onInputEnterKeyModule(moduleID: number, level: number) {
  //   this.confirmationDialogService
  //     .confirm(
  //       'Confirm Edit Parameters',
  //       'Light On hour: ' +
  //       this.nextLightOnTime +
  //       '\nLight off hour:' +
  //       this.nextLightOffTime +
  //       '\nRoot Humidity Low:' +
  //       this.nextHumidityLow +
  //       '\nRoot Humidity High:' +
  //       this.nextHumidityHigh
  //     )
  //     .then((confirmed) => {
  //       if (confirmed) {
  //         let gs = new GerminatorSettings();
  //         gs.lightOnTime = this.nextLightOnTime;
  //         gs.lightOffTime = this.nextLightOffTime;
  //         gs.humidityLow = this.nextHumidityLow;
  //         gs.humidityHigh = this.nextHumidityHigh;
  //
  //         let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();
  //         this.dashboardGerminatorService
  //           .updateGerminatorSettings(gs)
  //           .subscribe(
  //             (response: HttpResponse<any>) => {
  //               let fetchedData = JSON.parse(JSON.stringify(response.body));
  //
  //               receivedGerminatorSettings.isAuto = fetchedData['is_auto'];
  //               receivedGerminatorSettings.humidityLow =
  //                 fetchedData['humidity_low'];
  //               receivedGerminatorSettings.humidityHigh =
  //                 fetchedData['humidity_high'];
  //               receivedGerminatorSettings.lightOnTime =
  //                 fetchedData['light_on_time'];
  //               receivedGerminatorSettings.lightOffTime =
  //                 fetchedData['light_off_time'];
  //               receivedGerminatorSettings.mister = fetchedData['mister'];
  //               receivedGerminatorSettings.led = fetchedData['led'];
  //
  //               if (
  //                 JSON.stringify(gs) ==
  //                 JSON.stringify(receivedGerminatorSettings)
  //               ) {
  //                 this.prevLightOnTime = this.nextLightOnTime;
  //                 this.prevLightOffTime = this.nextLightOffTime;
  //                 this.prevHumidityLow = this.nextHumidityLow;
  //                 this.prevHumidityHigh = this.nextHumidityHigh;
  //
  //                 alert('Successful!');
  //               } else {
  //                 alert('Unsuccessful!');
  //               }
  //             },
  //             (error) => {
  //               alert('Unsuccessful!');
  //             }
  //           );
  //       }
  //     });
  // }
}
