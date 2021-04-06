import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Module } from '../../../../_models/module.model';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Room } from '../../../../_models/room.model';
import { LogSensorModuleLevel } from '../../../../_models/logsensormodulelevel.model';
import { LogSensorReservoir } from '../../../../_models/logsensorreservoir.model';
import { LogSensorRoom } from '../../../../_models/logsensorroom.model';
import { ReservoirSettings } from '../../../../_models/reservoirsettings.model';
import { ModuleSettings } from '../../../../_models/modulesettings.model';
import { DashboardGrowerService } from '../../../../_services/dashboard/dashboard-grower.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-grower-control-panel',
  templateUrl: './grower-control-panel.component.html',
  styleUrls: ['./grower-control-panel.component.css'],
})
export class GrowerControlPanelComponent implements OnInit {
  @Input() lsModule: Module[];
  @Input() lsReservoir: Reservoir[];
  @Input() lsRoom: Room[];

  lsLogSensorModuleLevel: LogSensorModuleLevel[];
  lsLogSensorReservoir: LogSensorReservoir[];
  lsLogSensorRoom: LogSensorRoom[];
  lsReservoirSettings: ReservoirSettings[];
  lsModuleSettings: ModuleSettings[];

  subRefreshSensor: Subscription;

  constructor(public dashboardGrowerService: DashboardGrowerService) {}

  ngOnInit(): void {
    this.dashboardGrowerService.updateGrowerDashboardCurrent();

    this.dashboardGrowerService.lsLogSensorModuleLevel.subscribe(
      (lsLogSensorModuleLevel) => {
        this.lsLogSensorModuleLevel = lsLogSensorModuleLevel;
      }
    );
    this.dashboardGrowerService.lsLogSensorReservoir.subscribe(
      (lsLogSensorReservoir) => {
        this.lsLogSensorReservoir = lsLogSensorReservoir;
      }
    );
    this.dashboardGrowerService.lsLogSensorRoom.subscribe((lsLogSensorRoom) => {
      this.lsLogSensorRoom = lsLogSensorRoom;
    });

    this.dashboardGrowerService.lsModuleSettings.subscribe(
      (lsModuleSettings) => {
        this.lsModuleSettings = lsModuleSettings;
      }
    );
    this.dashboardGrowerService.lsReservoirSettings.subscribe(
      (lsReservoirSettings) => {
        this.lsReservoirSettings = lsReservoirSettings;
      }
    );
    this.subRefreshSensor = interval(2000).subscribe(() => {
      this.dashboardGrowerService.getLatestGrowerSensorLogs();
    });

    this.dashboardGrowerService.getAllReservoirSettings();
    this.dashboardGrowerService.getAllModuleSettings();
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
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

  getSvNutrientStatus(reservoirID: number): number {
    let index = this.lsReservoirSettings.findIndex(
      (rs) => rs.reservoirID == reservoirID
    );
    return this.lsReservoirSettings[index] == undefined
      ? 0
      : this.lsReservoirSettings[index].svNutrient;
  }

  getSvWaterStatus(reservoirID: number): number {
    let index = this.lsReservoirSettings.findIndex(
      (rs) => rs.reservoirID == reservoirID
    );
    return this.lsReservoirSettings[index] == undefined
      ? 0
      : this.lsReservoirSettings[index].svWater;
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

  getModuleIsAuto(moduleID: number): number {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        return moduleSettings.isAuto;
      }
    }
  }

  getFanStatus(moduleID: number, level: number): number {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        switch (level) {
          case 1:
            return moduleSettings.fan1;

          case 2:
            return moduleSettings.fan2;
        }
      }
    }
  }

  getLedStatus(moduleID: number, level: number): number {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        switch (level) {
          case 1:
            return moduleSettings.led1;

          case 2:
            return moduleSettings.led2;
        }
      }
    }
  }

  onClickIsAuto(moduleID: number) {
    for (let moduleSettings of this.lsModuleSettings) {
      if (moduleSettings.moduleID == moduleID) {
        let tmpModuleSettings = cloneDeep(moduleSettings);
        tmpModuleSettings.isAuto = tmpModuleSettings.isAuto == 1 ? 0 : 1;

        this.dashboardGrowerService
          .updateModuleSettings(tmpModuleSettings)
          .then((success) => {
            if (!success) {
              alert('Failed to toggle IsAuto');
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

  getLevelsArray(lvl: number) {
    let levels = [];

    for (let i = 0; i < lvl; i++) {
      levels.push(i + 1);
    }

    return levels;
  }
}
