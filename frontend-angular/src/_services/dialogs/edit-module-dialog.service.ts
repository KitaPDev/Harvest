import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { Room } from '../../_models/room.model';
import { Reservoir } from '../../_models/reservoir.model';
import { EditModuleDialogComponent } from '../../app/_dialogs/edit-module-dialog/edit-module-dialog.component';

@Injectable()
export class EditModuleDialogService {
  constructor(private modalService: NgbModal) {}

  public init(
    index: number,
    moduleLabel: string,
    level: number,
    room: Room,
    reservoir: Reservoir
  ) {
    const modalRef = this.modalService.open(EditModuleDialogComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.moduleLabel = moduleLabel;
    modalRef.componentInstance.level = level;
    modalRef.componentInstance.selectedRoom = room;
    modalRef.componentInstance.selectedReservoir = reservoir;
  }
}
