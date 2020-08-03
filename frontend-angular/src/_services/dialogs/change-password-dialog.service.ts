import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { ChangePasswordDialogComponent } from '../../app/_dialogs/change-password-dialog/change-password-dialog.component';

@Injectable()
export class ChangePasswordDialogService {
  constructor(private modalService: NgbModal) {}

  public init(index: number, username: string) {
    const modalRef = this.modalService.open(ChangePasswordDialogComponent);
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.username = username;
  }
}
