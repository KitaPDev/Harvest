import { Injectable } from '@angular/core';
import { ConfirmationDialogComponent } from '../../app/_dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ConfirmationDialogService {
  constructor(private modalService: NgbModal) {}

  public confirm(
    title: string,
    message: string,
    btnConfirmText: string = 'Confirm',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: dialogSize,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnConfirmText = btnConfirmText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
