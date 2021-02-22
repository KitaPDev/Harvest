import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { Reservoir } from '../../../../../_models/reservoir.model';
import { LogSensorReservoir } from '../../../../../_models/logsensorreservoir.model';
import 'chartjs-plugin-zoom';
import { BatchesService } from '../../../../../_services/batches.service';
import { ActivatedRoute } from '@angular/router';
import { BatchDetail } from '../../../../../_models/batchdetail.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-batches-details-reservoir-item',
  templateUrl: './batches-details-reservoir-item.component.html',
  styleUrls: ['./batches-details-reservoir-item.component.css'],
})
export class BatchesDetailsReservoirItemComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: BaseChartDirective;

  @Input() reservoir: Reservoir;
  @Input() batchesService: BatchesService;

  batchID: number;
  logSensorReservoirs: LogSensorReservoir[];

  isDisplayDetails: boolean = false;

  // tds chart config
  tdsChartLabels = [];
  tdsChartDataSet = [{ data: [] }];
  tdsChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];

  tdsChartOptions = {
    scales: {
      title: {
        display: true,
        text: 'TDS',
      },
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

  // ph chart config
  pHChartLabels = [];
  pHChartDataSet = [{ data: [] }];
  pHChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];
  pHChartOptions = {
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

  // soln temp chart config
  temperatureSolutionChartLabels = [];
  temperatureSolutionChartDataSet = [
    {
      data: [],
    },
  ];
  temperatureSolutionChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];
  temperatureSolutionChartOptions = {
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
    this.logSensorReservoirs = recBatchID_BatchDetail[
      this.batchID
    ].logSensorReservoirs.filter(
      (log) => log.reservoirID === this.reservoir.reservoirID
    );

    let minDateTime = new Date(this.logSensorReservoirs[0].loggedAt);
    let maxDateTime = new Date(
      this.logSensorReservoirs[this.logSensorReservoirs.length - 1].loggedAt
    );

    this.tdsChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.tdsChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

    this.pHChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.pHChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

    this.temperatureSolutionChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
    this.temperatureSolutionChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

    this.tdsChartDataSet[0].data.length = 0;
    this.pHChartDataSet[0].data.length = 0;
    this.temperatureSolutionChartDataSet[0].data.length = 0;

    for (let log of this.logSensorReservoirs) {
      this.tdsChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.tds,
      });
      this.pHChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.ph,
      });
      this.temperatureSolutionChartDataSet[0].data.push({
        x: new Date(log.loggedAt).valueOf(),
        y: log.temperatureSolution,
      });
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
