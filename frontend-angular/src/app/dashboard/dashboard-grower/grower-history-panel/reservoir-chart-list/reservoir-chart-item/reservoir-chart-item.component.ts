import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseChartDirective, Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { LogSensorReservoir } from '../../../../../../_models/logsensorreservoir.model';
import { Reservoir } from '../../../../../../_models/reservoir.model';

@Component({
  selector: 'app-reservoir-chart-item',
  templateUrl: './reservoir-chart-item.component.html',
  styleUrls: ['./reservoir-chart-item.component.css'],
})
export class ReservoirChartItemComponent implements OnInit {
  @Input() reservoir: Reservoir;
  @Input() lsLogSensorReservoirHistory: LogSensorReservoir[];

  @ViewChildren(BaseChartDirective) lsReservoirChart: QueryList<
    BaseChartDirective
  >;

  reservoirChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  tdsChartLabels = [];
  tdsChartDataSet = [{ data: [] }];
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

  phChartLabels = [];
  phChartDataSet = [{ data: [] }];
  phChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'pH',
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

  solnTempChartLabels = [];
  solnTempChartDataSet = [{ data: [] }];
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

  constructor() {}

  ngOnInit(): void {
    this.setupCharts();
  }

  setupCharts() {
    if (this.lsLogSensorReservoirHistory != undefined) {
      if (this.lsLogSensorReservoirHistory.length > 0) {
        let minDateTime = new Date(
          this.lsLogSensorReservoirHistory[0].loggedAt
        );
        let maxDateTime = new Date(
          this.lsLogSensorReservoirHistory[
            this.lsLogSensorReservoirHistory.length - 1
          ].loggedAt
        );

        this.tdsChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.tdsChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.phChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.phChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.solnTempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.solnTempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.tdsChartDataSet[0].data.length = 0;
        this.phChartDataSet[0].data.length = 0;
        this.solnTempChartDataSet[0].data.length = 0;

        for (let log of this.lsLogSensorReservoirHistory) {
          this.tdsChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.tds,
          });
          this.phChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.ph,
          });
          this.solnTempChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureSolution,
          });
        }
      }
    }
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsReservoirChart._results[chartIndex].chart.resetZoom();
  }
}
