import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Room } from '../../../../../_models/room.model';
import { LogSensorRoom } from '../../../../../_models/logsensorroom.model';
import { BatchesService } from '../../../../../_services/batches.service';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { BatchDetail } from '../../../../../_models/batchdetail.model';

@Component({
  selector: 'app-batches-details-room-item',
  templateUrl: './batches-details-room-item.component.html',
  styleUrls: ['./batches-details-room-item.component.css'],
})
export class BatchesDetailsRoomItemComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  @Input() room: Room;
  @Input() batchesService: BatchesService;

  batchID: number;
  logSensorRooms: LogSensorRoom[];

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
  humidityChartOptions = {
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
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  constructor(private route: ActivatedRoute) {
    this.batchID = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.batchesService.recBatchID_BatchDetail.subscribe(
      (recBatchID_BatchDetail) => {
        if (recBatchID_BatchDetail[this.batchID] !== undefined) {
          this.setupCharts(recBatchID_BatchDetail);
        }
      }
    );
  }

  setupCharts(recBatchID_BatchDetail: Record<number, BatchDetail>) {
    this.logSensorRooms = recBatchID_BatchDetail[
      this.batchID
    ].logSensorRooms.filter((log) => log.roomID === this.room.roomID);

    if (this.logSensorRooms.length > 0) {
      let minDateTime = new Date(this.logSensorRooms[0].loggedAt);
      let maxDateTime = new Date(
        this.logSensorRooms[this.logSensorRooms.length - 1].loggedAt
      );

      this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
      this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

      this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
      this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

      this.tempChartDataSet[0].data.length = 0;
      this.humidityChartDataSet[0].data.length = 0;

      for (let log of this.logSensorRooms) {
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

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }

  onClickReset(chartIndex: number) {
    // @ts-ignore
    this.charts._results[chartIndex].chart.resetZoom();
  }
}
