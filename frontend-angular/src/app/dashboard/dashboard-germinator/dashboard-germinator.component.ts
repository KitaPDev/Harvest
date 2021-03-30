import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DashboardGerminatorService } from '../../../_services/dashboard/dashboard-germinator.service';
import { LogSensorGerminator } from '../../../_models/logsensorgerminator.model';
import { GerminatorSettings } from '../../../_models/germinatorsettings.model';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-germinator',
  templateUrl: './dashboard-germinator.component.html',
  styleUrls: ['./dashboard-germinator.component.css'],
})
export class DashboardGerminatorComponent implements OnInit {
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

  lsLogSensorGerminator: LogSensorGerminator[];
  germinatorSettings: GerminatorSettings = new GerminatorSettings();

  prevLightOnTime: number;
  prevLightOffTime: number;
  prevHumidityLow: number;
  prevHumidityHigh: number;

  nextLightOnTime: number;
  nextLightOffTime: number;
  nextHumidityLow: number;
  nextHumidityHigh: number;

  constructor(
    public dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    dashboardGerminatorService.updateGerminatorDashboard();
    dashboardGerminatorService.lsLogSensorGerminator.subscribe(
      (logSensorGerminators) => {
        this.lsLogSensorGerminator = logSensorGerminators;
      }
    );
  }

  ngOnInit(): void {
    this.dashboardGerminatorService
      .getAllGerminatorSettings()
      .then((germinatorSettings: GerminatorSettings) => {
        this.germinatorSettings = germinatorSettings;

        this.prevLightOnTime = germinatorSettings.lightOnTime;
        this.prevLightOffTime = germinatorSettings.lightOffTime;
        this.prevHumidityLow = germinatorSettings.humidityLow;
        this.prevHumidityHigh = germinatorSettings.humidityHigh;

        this.nextLightOnTime = this.prevLightOnTime;
        this.nextLightOffTime = this.prevLightOffTime;
        this.nextHumidityLow = this.prevHumidityLow;
        this.nextHumidityHigh = this.prevHumidityHigh;
      });

    this.initForms();

    this.dashboardGerminatorService.lsLogSensorGerminatorHistory.subscribe(
      (lsLogSensorGerminatorHistory) => {
        if (lsLogSensorGerminatorHistory != undefined) {
          let minDateTime = new Date(lsLogSensorGerminatorHistory[0].loggedAt);
          let maxDateTime = new Date(
            lsLogSensorGerminatorHistory[
              lsLogSensorGerminatorHistory.length - 1
            ].loggedAt
          );
        }
      }
    );

    if (this.lsLogSensorGerminator.length > 0) {
      let minDateTime = new Date(this.lsLogSensorGerminator[0].loggedAt);
      let maxDateTime = new Date(
        this.lsLogSensorGerminator[
          this.lsLogSensorGerminator.length - 1
        ].loggedAt
      );

      this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
      this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

      this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
      this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

      this.tempChartDataSet[0].data.length = 0;
      this.humidityChartDataSet[0].data.length = 0;

      for (let log of this.lsLogSensorGerminator) {
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

  onInputEnterKey() {
    this.confirmationDialogService
      .confirm(
        'Confirm Edit Parameters',
        'Light On hour: ' +
          this.nextLightOnTime +
          '\nLight off hour:' +
          this.nextLightOffTime +
          '\nHumidity Low:' +
          this.nextHumidityLow +
          '\nHumidity High:' +
          this.nextHumidityHigh
      )
      .then((confirmed) => {
        if (confirmed) {
          let gs = new GerminatorSettings();
          gs.lightOnTime = this.nextLightOnTime;
          gs.lightOffTime = this.nextLightOffTime;
          gs.humidityLow = this.nextHumidityLow;
          gs.humidityHigh = this.nextHumidityHigh;

          let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();
          this.dashboardGerminatorService
            .updateGerminatorSettings(gs)
            .subscribe(
              (response: HttpResponse<any>) => {
                let fetchedData = JSON.parse(JSON.stringify(response.body));

                receivedGerminatorSettings.isAuto = fetchedData['is_auto'];
                receivedGerminatorSettings.humidityLow =
                  fetchedData['humidity_low'];
                receivedGerminatorSettings.humidityHigh =
                  fetchedData['humidity_high'];
                receivedGerminatorSettings.lightOnTime =
                  fetchedData['light_on_time'];
                receivedGerminatorSettings.lightOffTime =
                  fetchedData['light_off_time'];
                receivedGerminatorSettings.mister = fetchedData['mister'];
                receivedGerminatorSettings.led = fetchedData['led'];

                if (
                  JSON.stringify(gs) ==
                  JSON.stringify(receivedGerminatorSettings)
                ) {
                  this.prevLightOnTime = this.nextLightOnTime;
                  this.prevLightOffTime = this.nextLightOffTime;
                  this.prevHumidityLow = this.nextHumidityLow;
                  this.prevHumidityHigh = this.nextHumidityHigh;

                  alert('Successful!');
                } else {
                  alert('Unsuccessful!');
                }
              },
              (error) => {
                alert('Unsuccessful!');
              }
            );
        }
      });
  }

  onSubmitHistoryPeriod() {
    let timeStampBegin = this.germinatorHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.germinatorHistoryForm.value['timeStampEnd'];

    this.confirmationDialogService
      .confirm(
        'Confirm Update History Data',
        'Time Begin: ' +
          new Date(timeStampBegin).toTimeString() +
          ' | Time End: ' +
          new Date(timeStampEnd).toTimeString(),
        'Confirm',
        'Cancel',
        'lg'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.dashboardGerminatorService.updateGerminatorDashboardHistoryData(
            timeStampBegin,
            timeStampEnd
          );
        }
      });
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsChart._results[chartIndex].chart.resetZoom();
  }
}
