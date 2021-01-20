import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../_models/room.model';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { RoomsService } from '../../../../_services/rooms.service';
import { EditRoomDialogService } from '../../../../_services/dialogs/edit-room-dialog.service';

@Component({
  selector: 'app-rooms-item',
  templateUrl: './rooms-item.component.html',
  styleUrls: ['./rooms-item.component.css'],
})
export class RoomsItemComponent implements OnInit {
  @Input() room: Room;
  @Input() index: number;
  @Input() roomsService: RoomsService;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private editRoomDialogService: EditRoomDialogService
  ) {}

  ngOnInit(): void {}

  onEditRoom() {
    this.editRoomDialogService.init(this.index, this.room.roomLabel);
  }

  onDeleteRoom() {
    this.confirmationDialogService
      .confirm('Confirm Delete Room', 'Room Label: ' + this.room.roomLabel)
      .then((confirmed) => {
        if (confirmed) {
          this.roomsService.deleteRoom(this.index);
        }
      });
  }
}
