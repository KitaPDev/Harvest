import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../../_models/reservoir.model';
import { LogSensorReservoir } from '../../../../../_models/logsensorreservoir.model';

@Component({
  selector: 'app-reservoir-chart-list',
  templateUrl: './reservoir-chart-list.component.html',
  styleUrls: ['./reservoir-chart-list.component.css'],
})
export class ReservoirChartListComponent implements OnInit {
  @Input() lsReservoir: Reservoir[];
  @Input() lsLogSensorReservoirHistory: LogSensorReservoir[];

  reservoirID_lsLogSensorRoomHistory: {
    [key: number]: LogSensorReservoir[];
  } = {};

  constructor() {}

  ngOnInit(): void {
    for (let log of this.lsLogSensorReservoirHistory) {
      if (
        this.reservoirID_lsLogSensorRoomHistory[log.reservoirID] == undefined
      ) {
        this.reservoirID_lsLogSensorRoomHistory[log.reservoirID] = [];
      }

      this.reservoirID_lsLogSensorRoomHistory[log.reservoirID].push(log);
    }
  }
}
