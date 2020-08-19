import { Component, Input, OnInit } from '@angular/core';
import { BatchesService } from '../../../../../../../_services/batches.service';
import { LogSensorModuleLevel } from '../../../../../../../_models/logsensormodule.model';

@Component({
  selector: 'app-batches-details-module-level-item',
  templateUrl: './batches-details-module-level-item.component.html',
  styleUrls: ['./batches-details-module-level-item.component.css'],
})
export class BatchesDetailsModuleLevelItemComponent implements OnInit {
  @Input() batchID: number;
  @Input() moduleID: number;
  @Input() level: number;

  logSensorModuleLevels: LogSensorModuleLevel[] = [];

  isDisplayDetails: boolean = false;

  // temp chart config
  tempChartType = 'line';
  tempChartLabels = [];
  tempChartData = [{ data: [] }];
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

  constructor(private batchesService: BatchesService) {
    batchesService.recBatchID_BatchDetail.subscribe((batchDetails) => {
      this.logSensorModuleLevels = batchDetails[
        this.batchID
      ].logSensorModuleLevels.filter(
        (log) => log.moduleID === this.moduleID && log.level === this.level
      );

      let tempData = [];
      let humidityData = [];
      let luxData = [];
      let logTimes = [];

      for (let log of this.logSensorModuleLevels) {
        tempData.push(log.temperature);
        humidityData.push(log.humidity);
        luxData.push(log.lux);
        logTimes.push(log.loggedAt);
      }

      this.tempChartData = [{ data: tempData }];
      this.tempChartLabels = logTimes;
    });
  }

  ngOnInit(): void {}

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
