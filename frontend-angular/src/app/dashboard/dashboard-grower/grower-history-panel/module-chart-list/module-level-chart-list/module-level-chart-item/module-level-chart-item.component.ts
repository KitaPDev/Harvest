import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseChartDirective, Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { LogSensorModuleLevel } from '../../../../../../../_models/logsensormodulelevel.model';

@Component({
  selector: 'app-module-level-chart-item',
  templateUrl: './module-level-chart-item.component.html',
  styleUrls: ['./module-level-chart-item.component.css'],
})
export class ModuleLevelChartItemComponent implements OnInit {
  @Input() lsLogSensorModuleLevelHistory: LogSensorModuleLevel[];

  @ViewChildren(BaseChartDirective) lsModuleLevelChart: QueryList<
    BaseChartDirective
  >;

  moduleLevelChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  tempRootChartLabels = [];
  tempRootChartDataSet = [{ data: [] }];
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

  humidityRootChartLabels = [];
  humidityRootChartDataSet = [{ data: [] }];
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

  constructor() {}

  ngOnInit(): void {
    this.setupCharts();
  }

  setupCharts() {
    if (this.lsLogSensorModuleLevelHistory != undefined) {
      if (this.lsLogSensorModuleLevelHistory.length > 0) {
        let minDateTime = new Date(
          this.lsLogSensorModuleLevelHistory[0].loggedAt
        );
        let maxDateTime = new Date(
          this.lsLogSensorModuleLevelHistory[
            this.lsLogSensorModuleLevelHistory.length - 1
          ].loggedAt
        );

        this.tempRootChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.tempRootChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.humidityRootChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.humidityRootChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.tempRootChartDataSet[0].data.length = 0;
        this.humidityRootChartDataSet[0].data.length = 0;

        for (let log of this.lsLogSensorModuleLevelHistory) {
          this.tempRootChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureRoot,
          });
          this.humidityRootChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidityRoot,
          });
        }
      }
    }
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsModuleLevelChart._results[chartIndex].chart.resetZoom();
  }
}
