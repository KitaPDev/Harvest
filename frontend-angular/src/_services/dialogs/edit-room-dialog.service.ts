import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";
import { EditRoomDialogComponent } from "../../app/_dialogs/edit-room-dialog/edit-room-dialog.component";

@Injectable()
export class EditRoomDialogService {
  constructor(private modalService: NgbModal) {
  }

  public init(index: number, roomLabel: string) {
    const modalRef = this.modalService.open(EditRoomDialogComponent);
    modalRef.componentInstance.index = index
    modalRef.componentInstance.roomLabel = roomLabel;
  }
}
