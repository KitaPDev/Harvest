import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DashboardGrowerService } from '../../../../_services/dashboard/dashboard-grower.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { BaseChartDirective, Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../../_models/module.model';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Room } from '../../../../_models/room.model';

@Component({
  selector: 'app-grower-history-panel',
  templateUrl: './grower-history-panel.component.html',
  styleUrls: ['./grower-history-panel.component.css'],
})
export class GrowerHistoryPanelComponent implements OnInit {
  @ViewChildren(BaseChartDirective) lsRoomChart: QueryList<BaseChartDirective>;
  @ViewChildren(BaseChartDirective) lsReservoirChart: QueryList<
    BaseChartDirective
  >;
  @ViewChildren(BaseChartDirective) lsModuleLevelChart: QueryList<
    BaseChartDirective
  >;

  @Input() lsModule: Module[];
  @Input() lsReservoir: Reservoir[];
  @Input() lsRoom: Room[];

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

  isUpdateHistoryClicked: boolean = false;

  constructor(
    public dashboardGrowerService: DashboardGrowerService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    if (this.dashboardGrowerService.lsLogSensorRoomHistory != undefined) {
      this.dashboardGrowerService.lsLogSensorRoomHistory.subscribe(
        (lsLogSensorRoomHistory) => {
          for (let log of lsLogSensorRoomHistory) {
            if (this.recRoomID_recDataType_roomChartDataSet != undefined) {
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
        }
      );
    }

    this.dashboardGrowerService.lsLogSensorReservoirHistory.subscribe(
      (lsLogSensorReservoirHistory) => {
        for (let log of lsLogSensorReservoirHistory) {
          if (
            this.recReservoirID_recDataType_reservoirChartDataSet != undefined
          ) {
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
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevelHistory.subscribe(
      (lsLogSensorModuleLevelHistory) => {
        for (let log of lsLogSensorModuleLevelHistory) {
          if (
            this.recModuleID_recLevel_recDataType_moduleLevelChartDataSet !=
            undefined
          ) {
            this.recModuleID_recLevel_recDataType_moduleLevelChartDataSet[
              log.moduleID
            ][log.level][0][0].data.push({
              x: new Date(log.loggedAt).valueOf(),
              y: log.humidityRoot,
            });
            this.recModuleID_recLevel_recDataType_moduleLevelChartDataSet[
              log.moduleID
            ][log.level][0][1].data.push({
              x: new Date(log.loggedAt).valueOf(),
              y: log.temperatureRoot,
            });
          }
        }
      }
    );

    this.initForms();
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

  getLevelsArray(lvl: number) {
    let levels = [];

    for (let i = 0; i < lvl; i++) {
      levels.push(i + 1);
    }

    return levels;
  }
}
