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

  objRoomID_dataType_roomChartDataSet: {
    [key: number]: { [key: number]: { data: any[] } };
  } = {};

  objReservoirID_dataType_reservoirChartDataSet: {
    [key: number]: { [key: number]: { data: any[] } };
  } = {};

  objModuleID_level_dataType_moduleLevelChartDataSet: {
    [key: number]: { [key: number]: { [key: number]: { data: any[] } } };
  } = {};

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
    for (let room of this.lsRoom) {
      this.objRoomID_dataType_roomChartDataSet[room.roomID] = {
        0: { data: [] },
        1: { data: [] },
      };
    }

    for (let reservoir of this.lsReservoir) {
      this.objReservoirID_dataType_reservoirChartDataSet[
        reservoir.reservoirID
      ] = {
        0: { data: [] },
        1: { data: [] },
        2: { data: [] },
      };
    }

    for (let module of this.lsModule) {
      for (let level of this.getLevelsArray(module.level)) {
        let temp = {};
        temp[level] = {
          0: { data: [] },
          1: { data: [] },
        };

        this.objModuleID_level_dataType_moduleLevelChartDataSet[
          module.moduleID
        ] = temp;
      }
    }

    this.dashboardGrowerService.lsLogSensorRoomHistory.subscribe(
      (lsLogSensorRoomHistory) => {
        for (let log of lsLogSensorRoomHistory) {
          this.objRoomID_dataType_roomChartDataSet[log.roomID][0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidity,
          });
          this.objRoomID_dataType_roomChartDataSet[log.roomID][1].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperature,
          });
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorReservoirHistory.subscribe(
      (lsLogSensorReservoirHistory) => {
        for (let log of lsLogSensorReservoirHistory) {
          this.objReservoirID_dataType_reservoirChartDataSet[
            log.reservoirID
          ][0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.tds,
          });
          this.objReservoirID_dataType_reservoirChartDataSet[
            log.reservoirID
          ][1].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.ph,
          });
          this.objReservoirID_dataType_reservoirChartDataSet[
            log.reservoirID
          ][2].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureSolution,
          });
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevelHistory.subscribe(
      (lsLogSensorModuleLevelHistory) => {
        for (let log of lsLogSensorModuleLevelHistory) {
          this.objModuleID_level_dataType_moduleLevelChartDataSet[log.moduleID][
            log.level
          ][0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidityRoot,
          });
          this.objModuleID_level_dataType_moduleLevelChartDataSet[log.moduleID][
            log.level
          ][1].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureRoot,
          });
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

    if (timeStampBegin > timeStampEnd) {
      alert('Time Begin must be before Time End!');
    } else {
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
            this.dashboardGrowerService.updateGrowerDashboardHistory(
              timeStampBegin,
              timeStampEnd
            );
          }

          this.isUpdateHistoryClicked = true;
        });
    }
  }

  getLevelsArray(lvl: number) {
    let levels = [];

    for (let i = 0; i < lvl; i++) {
      levels.push(i + 1);
    }

    return levels;
  }
}
