import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../../_models/reservoir.model';
import { LogSensorReservoir } from '../../../../../_models/logsensorreservoir.model';
import 'chartjs-plugin-zoom';
import { BatchesService } from '../../../../../_services/batches.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batches-details-reservoir-item',
  templateUrl: './batches-details-reservoir-item.component.html',
  styleUrls: ['./batches-details-reservoir-item.component.css'],
})
export class BatchesDetailsReservoirItemComponent implements OnInit {
  @Input() batchID: number;
  @Input() reservoir: Reservoir;

  logSensorReservoirs: LogSensorReservoir[];

  isDisplayDetails: boolean = false;

  // tds chart config
  tdsChartType = 'line';
  tdsChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  tdsChartData = [{ data: [650, 600, 590, 640, 700, 500, 600] }];
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
      xAxes: [
        {
          type: 'time',
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'TDS (ppm)',
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
            x: this.tdsChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.tdsChartLabels[this.tdsChartLabels.length - 1],
            y: null,
          },
        },
      },
    },
  };

  // ph chart config
  pHChartType = 'line';
  pHChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  pHChartData = [{ data: [7.0, 6.0, 6.5, 6.8, 6.9, 7.1, 6.0] }];
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
            labelString: 'pH',
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
            x: this.pHChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.pHChartLabels[this.pHChartLabels.length - 1],
            y: null,
          },
        },
        zoom: {
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
      },
    },
  };

  // soln temp chart config
  solnTempChartType = 'line';
  solnTempChartLabels = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  solnTempChartData = [
    {
      data: [25.7, 26.0, 24.9, 25.5, 26.1, 25.7, 27.0],
    },
  ];
  solnTempChartColors: Array<any> = [
    {
      borderColor: '#3D998A',
      pointBackgroundColor: '#3D998A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3D998A',
    },
  ];
  solnTempChartOptions = {
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
            labelString: 'Solution Temperature (Celsius)',
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
            x: this.solnTempChartLabels[0],
            y: 0,
          },
          rangeMax: {
            x: this.solnTempChartLabels[this.solnTempChartLabels.length - 1],
            y: null,
          },
        },
        zoom: {
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
    this.batchesService.recBatchID_BatchDetail.subscribe((batchDetails) => {
      this.logSensorReservoirs = batchDetails[
        this.batchID
      ].logSensorReservoirs.filter(
        (log) => log.reservoirID === this.reservoir.reservoirID
      );
    });
  }

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
