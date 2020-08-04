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

  constructor() {}

  ngOnInit(): void {
    this.logSensorRooms.filter((log) => log.roomID === this.room.roomID);
  }
}
