import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { LogSensorGerminator } from '../../../../../_models/logsensorgerminator.model';

@Component({
  selector: 'app-germinator-history-charts',
  templateUrl: './germinator-history-charts.component.html',
  styleUrls: ['./germinator-history-charts.component.css'],
})
export class GerminatorHistoryChartsComponent implements OnInit {
  @Input() lsLogSensorGerminatorHistory: LogSensorGerminator[];

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

  constructor() {}

  ngOnInit(): void {
    if (this.lsLogSensorGerminatorHistory.length > 0) {
      let minDateTime = new Date(this.lsLogSensorGerminatorHistory[0].loggedAt);
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

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsChart._results[chartIndex].chart.resetZoom();
  }
}
