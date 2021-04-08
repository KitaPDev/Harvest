import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../../../_models/room.model';
import { DashboardGrowerService } from '../../../../../../_services/dashboard/dashboard-grower.service';
import { LogSensorRoom } from '../../../../../../_models/logsensorroom.model';

@Component({
  selector: 'app-grower-room-control-panel-item',
  templateUrl: './grower-room-control-panel-item.component.html',
  styleUrls: ['./grower-room-control-panel-item.component.css'],
})
export class GrowerRoomControlPanelItemComponent implements OnInit {
  @Input() room: Room;
  @Input() dashboardGrowerService: DashboardGrowerService;

  logSensorRoom: LogSensorRoom;

  constructor() {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsLogSensorRoom.subscribe((lsLogSensorRoom) => {
      for (let log of lsLogSensorRoom) {
        if (log.roomID == this.room.roomID) {
          this.logSensorRoom = log;
        }
      }
    });
  }

  getRoomTemperature(): string {
    if (this.logSensorRoom != undefined) {
      return this.logSensorRoom.temperature.toString();
    }

    return 'N/A';
  }

  getRoomHumidity(): string {
    if (this.logSensorRoom != undefined) {
      return this.logSensorRoom.humidity.toString();
    }

    return 'N/A';
  }
}
