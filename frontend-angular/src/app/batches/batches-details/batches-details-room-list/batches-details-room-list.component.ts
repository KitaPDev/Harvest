import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../_models/room.model';
import { LogSensorRoom } from '../../../../_models/logsensorroom.model';

@Component({
  selector: 'app-batches-details-room-list',
  templateUrl: './batches-details-room-list.component.html',
  styleUrls: ['./batches-details-room-list.component.css'],
})
export class BatchesDetailsRoomListComponent implements OnInit {
  @Input() roomIDs: number[];
  @Input() rooms: Room[];
  @Input() logSensorRooms: LogSensorRoom[];

  constructor() {}

  ngOnInit(): void {}
}
