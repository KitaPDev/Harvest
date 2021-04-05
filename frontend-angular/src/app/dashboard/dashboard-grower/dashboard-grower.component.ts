import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseChartDirective, Color } from 'ng2-charts';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-grower',
  templateUrl: './dashboard-grower.component.html',
  styleUrls: ['./dashboard-grower.component.css'],
})
export class DashboardGrowerComponent implements OnInit {
  @ViewChildren(BaseChartDirective) lsRoomChart: QueryList<BaseChartDirective>;
  @ViewChildren(BaseChartDirective) lsReservoirChart: QueryList<
    BaseChartDirective
  >;
  @ViewChildren(BaseChartDirective) lsModuleLevelChart: QueryList<
    BaseChartDirective
  >;

  recRoomID_recDataType_roomChartDataSet: Record<
    number,
    Record<number, { data: any[] }[]>
  >;
  recReservoirID_recDataType_reservoirChartDataSet: Record<
    number,
    Record<number, { data: any[] }[]>
  >;
  recModuleID_recLevel_recDataType_moduleLevelChartDataSet: Record<
    number,
    Record<number, Record<number, { data: any[] }[]>>
  >;

  roomChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];
  reservoirChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];
  moduleLevelChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  tempChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Temperature',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Celsius',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  humidityChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Humidity',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '%',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  tdsChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'TDS',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'ppm',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  phChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Humidity',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  solnTempChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Solution Temperature',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Celsius',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  tempRootChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Root Temperature',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Celsius',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  humidityRootChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'Root Humidity',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            source: 'data',
            min: new Date().valueOf(),
            max: new Date().valueOf(),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '%',
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  growerHistoryForm: FormGroup;

  isDisplayCurrent: boolean = true;
  isUpdateHistoryClicked: boolean = false;

  subRefreshSensor: Subscription;

  lsModule: Module[];
  lsReservoir: Reservoir[];
  lsRoom: Room[];
  lsLogSensorModuleLevel: LogSensorModuleLevel[];
  lsLogSensorReservoir: LogSensorReservoir[];
  lsLogSensorRoom: LogSensorRoom[];
  lsReservoirSettings: ReservoirSettings[];
  lsModuleSettings: ModuleSettings[];

  constructor(
    public dashboardGrowerService: DashboardGrowerService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dashboardGrowerService.updateGrowerDashboardCurrent();
    this.dashboardGrowerService.lsModule.subscribe((lsModule) => {
      this.lsModule = lsModule;
    });
    this.dashboardGrowerService.lsReservoir.subscribe((lsReservoir) => {
      this.lsReservoir = lsReservoir;
    });
    this.dashboardGrowerService.lsRoom.subscribe((lsRoom) => {
      this.lsRoom = lsRoom;
    });
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
      if (this.isDisplayCurrent) {
        this.dashboardGrowerService.getLatestGrowerSensorLogs();
      }
    });

    this.dashboardGrowerService.getAllReservoirSettings();
    this.dashboardGrowerService.getAllModuleSettings();

    if (this.dashboardGrowerService.lsLogSensorRoomHistory != undefined) {
      this.dashboardGrowerService.lsLogSensorRoomHistory.subscribe(
        (lsLogSensorRoomHistory) => {
          for (let log of lsLogSensorRoomHistory) {
            this.recRoomID_recDataType_roomChartDataSet[
              log.roomID
            ][0][0].data.push({
              x: new Date(log.loggedAt).valueOf(),
              y: log.humidity,
            });
            this.recRoomID_recDataType_roomChartDataSet[
              log.roomID
            ][1][0].data.push({
              x: new Date(log.loggedAt).valueOf(),
              y: log.temperature,
            });
          }
        }
      );
    }

    this.dashboardGrowerService.lsLogSensorReservoirHistory.subscribe(
      (lsLogSensorReservoirHistory) => {
        for (let log of lsLogSensorReservoirHistory) {
          this.recReservoirID_recDataType_reservoirChartDataSet[
            log.reservoirID
          ][0][0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.tds,
          });
          this.recReservoirID_recDataType_reservoirChartDataSet[
            log.reservoirID
          ][0][1].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.ph,
          });
          this.recReservoirID_recDataType_reservoirChartDataSet[
            log.reservoirID
          ][0][2].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureSolution,
          });
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevelHistory.subscribe(
      (lsLogSensorReservoirHistory) => {
        for (let log of lsLogSensorReservoirHistory) {
          this.recRoomID_recDataType_roomChartDataSet[log.moduleID][
            log.level
          ][0][0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidityRoot,
          });
          this.recRoomID_recDataType_roomChartDataSet[log.moduleID][
            log.level
          ][0][1].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureRoot,
          });
        }
      }
    );

    this.initForms();
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
  }

  initForms() {
    let timezoneOffset = new Date().getTimezoneOffset() * 60000;

    this.growerHistoryForm = new FormGroup({
      timeStampBegin: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
      timeStampEnd: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
    });
  }

  setDisplayMode(mode: number): void {
    this.isDisplayCurrent = mode == 1;
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

  onSubmitHistoryPeriod() {
    let timeStampBegin = this.growerHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.growerHistoryForm.value['timeStampEnd'];

    this.confirmationDialogService
      .confirm(
        'Confirm Update History Data',
        'Time Begin: ' +
          new Date(timeStampBegin).toLocaleString('it-IT') +
          ' | Time End: ' +
          new Date(timeStampEnd).toLocaleString('it-IT'),
        'Confirm',
        'Cancel',
        'lg'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.dashboardGrowerService.updateGrowerDashboardHistory(
            timeStampBegin,
            timeStampEnd
          );
        }

        this.isUpdateHistoryClicked = true;
      });
  }
}
