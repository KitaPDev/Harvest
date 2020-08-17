import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../../_models/module.model';
import { LogSensorModuleLevel } from '../../../../../_models/logsensormodule.model';

@Component({
  selector: 'app-batches-details-module-item',
  templateUrl: './batches-details-module-item.component.html',
  styleUrls: ['./batches-details-module-item.component.css'],
})
export class BatchesDetailsModuleItemComponent implements OnInit {
  @Input() module: Module;
  @Input() logSensorModuleLevels: LogSensorModuleLevel[];

  isDisplayDetails: boolean = false;

  // temp chart config
  tempChartType = 'line';
  tempChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  tempChartData = [{ data: [650, 600, 590, 640, 700, 500, 600] }];
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
            y: 0,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: this.tempChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.tempChartLabels[this.tempChartLabels.length - 1],
            y: null,
          },
        },
      },
    },
  };

  // humidity chart config
  humidityChartType = 'line';
  humidityChartLabels = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  humidityChartData = [{ data: [650, 600, 590, 640, 700, 500, 600] }];
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
            y: 0,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: this.tempChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.tempChartLabels[this.tempChartLabels.length - 1],
            y: null,
          },
        },
      },
    },
  };

  // lux chart config
  luxChartType = 'line';
  luxChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  luxChartData = [{ data: [650, 600, 590, 640, 700, 500, 600] }];
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
            y: 0,
          },
          rangeMax: {
            x: null,
            y: null,
          },
        },
        zoom: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: this.tempChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.tempChartLabels[this.tempChartLabels.length - 1],
            y: null,
          },
        },
      },
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.logSensorModuleLevels.filter(
      (log) => log.moduleID === this.module.moduleID
    );
  }

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
