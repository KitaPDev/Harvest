import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../_models/room.model';

@Component({
  selector: 'app-batches-details-room-list',
  templateUrl: './batches-details-room-list.component.html',
  styleUrls: ['./batches-details-room-list.component.css'],
})
export class BatchesDetailsRoomListComponent implements OnInit {
  @Input() batchID: number;
  @Input() rooms: Room[];

  constructor() {}

  ngOnInit(): void {}
}
