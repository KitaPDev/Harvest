import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RoomsService } from "../../_services/rooms.service";
import { ConfirmationDialogService } from "../../_services/dialogs/confirmation-dialog.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  createRoomForm: FormGroup;

  constructor(private roomsService: RoomsService,
              private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let roomLabel = '';

    this.createRoomForm = new FormGroup({
      'roomLabel': new FormControl(roomLabel, Validators.required),
    });

  }

  onSubmitCreateRoom() {
    let roomLabel = this.createRoomForm.value['roomLabel'];

    if (roomLabel.length === 0) {
      alert('Please fill in all fields!');
      return;
    }

    this.confirmationDialogService.confirm(
      'Confirm Create Room',
      'Room Label: ' + roomLabel
    ).then((confirmed) => {
        if(confirmed) {
          this.initForms();

          this.roomsService.createRoom(roomLabel);
        }
      }
    );
  }
}
