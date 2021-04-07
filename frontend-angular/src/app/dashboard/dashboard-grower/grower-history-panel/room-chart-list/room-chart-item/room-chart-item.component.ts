import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseChartDirective, Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { LogSensorRoom } from '../../../../../../_models/logsensorroom.model';
import { BatchDetail } from '../../../../../../_models/batchdetail.model';
import { Room } from '../../../../../../_models/room.model';

@Component({
  selector: 'app-room-chart-item',
  templateUrl: './room-chart-item.component.html',
  styleUrls: ['./room-chart-item.component.css'],
})
export class RoomChartItemComponent implements OnInit {
  @Input() room: Room;
  @Input() lsLogSensorRoomHistory: LogSensorRoom[];

  @ViewChildren(BaseChartDirective) lsRoomChart: QueryList<BaseChartDirective>;

  roomChartColors: Color[] = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  tempChartLabels = [];
  tempChartDataSet = [{ data: [] }];
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

  humidityChartLabels = [];
  humidityChartDataSet = [{ data: [] }];
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
    this.setupCharts();
  }

  setupCharts() {
    if (this.lsLogSensorRoomHistory != undefined) {
      if (this.lsLogSensorRoomHistory.length > 0) {
        let minDateTime = new Date(this.lsLogSensorRoomHistory[0].loggedAt);
        let maxDateTime = new Date(
          this.lsLogSensorRoomHistory[
            this.lsLogSensorRoomHistory.length - 1
          ].loggedAt
        );

        this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.humidityChartDataSet[0].data.length = 0;
        this.tempChartDataSet[0].data.length = 0;

        for (let log of this.lsLogSensorRoomHistory) {
          this.humidityChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidity,
          });
          this.tempChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperature,
          });
        }
      }
    }
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.lsRoomChart._results[chartIndex].chart.resetZoom();
  }
}
