import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../_models/room.model';
import { BatchesService } from '../../../../_services/batches.service';

@Component({
  selector: 'app-batches-details-room-list',
  templateUrl: './batches-details-room-list.component.html',
  styleUrls: ['./batches-details-room-list.component.css'],
})
export class BatchesDetailsRoomListComponent implements OnInit {
  @Input() rooms: Room[];
  @Input() batchesService: BatchesService;

  constructor() {}

  ngOnInit(): void {}
}
