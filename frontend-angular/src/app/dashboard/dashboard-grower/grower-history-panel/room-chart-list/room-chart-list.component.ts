import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../../_models/room.model';
import { LogSensorRoom } from '../../../../../_models/logsensorroom.model';

@Component({
  selector: 'app-room-chart-list',
  templateUrl: './room-chart-list.component.html',
  styleUrls: ['./room-chart-list.component.css'],
})
export class RoomChartListComponent implements OnInit {
  @Input() lsRoom: Room[];
  @Input() lsLogSensorRoomHistory: LogSensorRoom[];

  roomID_lsLogSensorRoomHistory: { [key: number]: LogSensorRoom[] } = {};

  constructor() {}

  ngOnInit(): void {
    for (let log of this.lsLogSensorRoomHistory) {
      if (this.roomID_lsLogSensorRoomHistory[log.roomID] == undefined) {
        this.roomID_lsLogSensorRoomHistory[log.roomID] = [];
      }

      this.roomID_lsLogSensorRoomHistory[log.roomID].push(log);
    }
  }
}
