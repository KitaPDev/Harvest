import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BatchesService } from '../../../../../../../_services/batches.service';
import { LogSensorModuleLevel } from '../../../../../../../_models/logsensormodule.model';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-batches-details-module-level-item',
  templateUrl: './batches-details-module-level-item.component.html',
  styleUrls: ['./batches-details-module-level-item.component.css'],
})
export class BatchesDetailsModuleLevelItemComponent implements OnInit {
  @ViewChild('tempChart') tempChart: Chart;

  @Input() moduleID: number;
  @Input() level: number;
  @Input() logSensorModuleLevels: LogSensorModuleLevel[];

  batchID: number;

  isDisplayDetails: boolean = false;

  // temp chart config
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

  tempChartOptions = {
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
            labelString: 'Temperature (Celsius)',
          },
        },
      ],
    },
    scaleShowVerticalLines: false,
    responsive: true,
    aspectRatio: 5,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'xy',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
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
  humidityChartOptions = {
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
            labelString: 'Humidity (%)',
          },
        },
      ],
    },
    scaleShowVerticalLines: false,
    responsive: true,
    aspectRatio: 5,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'xy',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
      },
    },
  };

  // lux chart config
  luxChartDataSet = [{ data: [] }];
  luxChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  // lux chart config
  luxChartOptions = {
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
            labelString: 'Lux (lumen)',
          },
        },
      ],
    },
    scaleShowVerticalLines: false,
    responsive: true,
    aspectRatio: 5,
    legend: {
      display: false,
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'xy',
          rangeMin: {
            x: null,
            y: null,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
      },
    },
  };

  constructor(
    private batchesService: BatchesService,
    private route: ActivatedRoute
  ) {
    this.batchID = +this.route.snapshot.params['id'];
    batchesService.fetchBatchDetails(this.batchID);
  }

  ngOnInit(): void {
    this.logSensorModuleLevels = this.logSensorModuleLevels.filter(
      (log) => log.level === this.level
    );

    let minDateTime = new Date(this.logSensorModuleLevels[0].loggedAt);
    let maxDateTime = new Date(
      this.logSensorModuleLevels[this.logSensorModuleLevels.length - 1].loggedAt
    );

    this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();
    this.tempChartOptions.plugins.zoom.zoom.rangeMin.x = minDateTime.valueOf();
    this.tempChartOptions.plugins.zoom.zoom.rangeMin.y = 0;
    this.tempChartOptions.plugins.zoom.zoom.rangeMax.x = maxDateTime.valueOf();

    this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();
    this.humidityChartOptions.plugins.zoom.zoom.rangeMin.x = minDateTime.valueOf();
    this.tempChartOptions.plugins.zoom.zoom.rangeMin.y = 0;
    this.humidityChartOptions.plugins.zoom.zoom.rangeMax.x = maxDateTime.valueOf();

    this.luxChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.luxChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();
    this.luxChartOptions.plugins.zoom.zoom.rangeMin.x = minDateTime.valueOf();
    this.tempChartOptions.plugins.zoom.zoom.rangeMin.y = 0;
    this.luxChartOptions.plugins.zoom.zoom.rangeMax.x = maxDateTime.valueOf();

    this.tempChartDataSet[0].data.length = 0;
    this.humidityChartDataSet[0].data.length = 0;
    this.luxChartDataSet[0].data.length = 0;

    for (let log of this.logSensorModuleLevels) {
      this.tempChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.temperature,
      });
      this.humidityChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.humidity,
      });
      this.luxChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.lux,
      });
    }
  }

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
