import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogSensorGerminator } from '../../../../_models/logsensorgerminator.model';
import { DashboardGerminatorService } from '../../../../_services/dashboard/dashboard-germinator.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';

@Component({
  selector: 'app-germinator-history-panel',
  templateUrl: './germinator-history-panel.component.html',
  styleUrls: ['./germinator-history-panel.component.css'],
})
export class GerminatorHistoryPanelComponent implements OnInit {
  @ViewChildren(BaseChartDirective) lsChart: QueryList<BaseChartDirective>;

  tempChartDataSet = [{ data: [] }];
  tempChartColors: Array<any> = [
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

  // humidity chart config
  humidityChartDataSet = [{ data: [] }];
  humidityChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  // humidity chart config
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

  germinatorHistoryForm: FormGroup;
  lsLogSensorGerminatorHistory: LogSensorGerminator[];

  isUpdateHistoryClicked: boolean = false;

  constructor(
    public dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.dashboardGerminatorService.lsLogSensorGerminatorHistory.subscribe(
      (lsLogSensorGerminatorHistory) => {
        if (lsLogSensorGerminatorHistory != undefined) {
          this.lsLogSensorGerminatorHistory = lsLogSensorGerminatorHistory;

          if (this.lsLogSensorGerminatorHistory.length > 0) {
            let minDateTime = new Date(
              this.lsLogSensorGerminatorHistory[0].loggedAt
            );
            let maxDateTime = new Date(
              this.lsLogSensorGerminatorHistory[
                this.lsLogSensorGerminatorHistory.length - 1
              ].loggedAt
            );

            this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
            this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

            this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
            this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

            this.tempChartDataSet[0].data.length = 0;
            this.humidityChartDataSet[0].data.length = 0;

            for (let log of this.lsLogSensorGerminatorHistory) {
              this.tempChartDataSet[0].data.push({
                x: new Date(log.loggedAt).valueOf(),
                y: log.temperature,
              });
              this.humidityChartDataSet[0].data.push({
                x: new Date(log.loggedAt).valueOf(),
                y: log.humidity,
              });
            }
          }
        }
      }
    );
  }

  initForms() {
    let timezoneOffset = new Date().getTimezoneOffset() * 60000;

    this.germinatorHistoryForm = new FormGroup({
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
    let timeStampBegin = this.germinatorHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.germinatorHistoryForm.value['timeStampEnd'];

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
            this.dashboardGerminatorService.updateGerminatorDashboardHistoryData(
              timeStampBegin,
              timeStampEnd
            );
          }

          this.isUpdateHistoryClicked = true;
        });
    }
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsChart._results[chartIndex].chart.resetZoom();
  }
}
