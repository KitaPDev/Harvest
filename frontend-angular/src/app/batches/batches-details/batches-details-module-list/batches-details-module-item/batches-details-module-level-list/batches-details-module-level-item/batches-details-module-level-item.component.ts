import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BatchesService } from '../../../../../../../_services/batches.service';
import { LogSensorModuleLevel } from '../../../../../../../_models/logsensormodulelevel.model';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-batches-details-module-level-item',
  templateUrl: './batches-details-module-level-item.component.html',
  styleUrls: ['./batches-details-module-level-item.component.css'],
})
export class BatchesDetailsModuleLevelItemComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  @Input() moduleID: number;
  @Input() level: number;
  @Input() logSensorModuleLevels: LogSensorModuleLevel[];
  @Input() batchesService: BatchesService;
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

  humidityChartOptions = {
    scales: {
      title: {
        display: true,
        text: 'Root Humidity',
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
    if (this.logSensorModuleLevels != undefined) {
      this.logSensorModuleLevels = this.logSensorModuleLevels.filter(
        (log) => log.level === this.level
      );

      if (this.logSensorModuleLevels.length > 0) {
        let minDateTime = new Date(this.logSensorModuleLevels[0].loggedAt);
        let maxDateTime = new Date(
          this.logSensorModuleLevels[
            this.logSensorModuleLevels.length - 1
          ].loggedAt
        );

        this.tempChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.tempChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.humidityChartOptions.scales.xAxes[0].ticks.min = minDateTime.valueOf();
        this.humidityChartOptions.scales.xAxes[0].ticks.max = maxDateTime.valueOf();

        this.tempChartDataSet[0].data.length = 0;
        this.humidityChartDataSet[0].data.length = 0;

        for (let log of this.logSensorModuleLevels) {
          this.tempChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.temperatureRoot,
          });
          this.humidityChartDataSet[0].data.push({
            x: new Date(log.loggedAt).valueOf(),
            y: log.humidityRoot,
          });
        }
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
