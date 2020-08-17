import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../../_models/room.model';
import { LogSensorRoom } from '../../../../../_models/logsensorroom.model';

@Component({
  selector: 'app-batches-details-room-item',
  templateUrl: './batches-details-room-item.component.html',
  styleUrls: ['./batches-details-room-item.component.css'],
})
export class BatchesDetailsRoomItemComponent implements OnInit {
  @Input() room: Room;
  @Input() logSensorRooms: LogSensorRoom[];

  isDisplayDetails: boolean = true;

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

  constructor() {}

  ngOnInit(): void {
    this.logSensorRooms.filter((log) => log.roomID === this.room.roomID);
  }

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
