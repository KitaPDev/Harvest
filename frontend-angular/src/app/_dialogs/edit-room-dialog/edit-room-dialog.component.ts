import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialogService } from "../../../_services/dialogs/confirmation-dialog.service";
import { RoomsService } from "../../../_services/rooms.service";

@Component({
  selector: 'app-edit-room-dialog',
  templateUrl: './edit-room-dialog.component.html',
  styleUrls: ['./edit-room-dialog.component.css']
})
export class EditRoomDialogComponent implements OnInit {
  editRoomForm: FormGroup;
  @Input() roomLabel: string;
  @Input() index: number

  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private roomsService: RoomsService) { }

  ngOnInit() {
    this.initForms();
  }

  public cancel() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  initForms() {
    this.editRoomForm = new FormGroup({
      'roomLabel': new FormControl(this.roomLabel, Validators.required),
    });
  }

  public onSubmitEditRoom() {
    let roomLabel = this.editRoomForm.value['roomLabel'];

    if (roomLabel.length === 0) {
      alert('Please fill in all fields!');
      return;
    }

    this.confirmationDialogService.confirm(
      'Confirm Room Edit',
      'Room Label: ' + this.roomLabel
    ).then((confirmed) => {
        if(confirmed) {
          this.roomsService.editRoom(this.index, roomLabel);
          this.dismiss();
        }
      }
    );
  }
}
