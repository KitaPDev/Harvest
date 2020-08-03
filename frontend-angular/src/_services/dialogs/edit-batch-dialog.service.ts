import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { EditBatchDialogComponent } from '../../app/_dialogs/edit-batch-dialog/edit-batch-dialog.component';
import { Reservoir } from '../../_models/reservoir.model';
import { Nutrient } from '../../_models/nutrient.model';
import { Module } from '../../_models/module.model';
import { Room } from '../../_models/room.model';
import { Batch } from '../../_models/batch.model';
import { Plant } from '../../_models/plant.model';

@Injectable()
export class EditBatchDialogService {
  constructor(private modalService: NgbModal) {}

  public init(
    batch: Batch,
    reservoirs: Reservoir[],
    nutrients: Nutrient[],
    modules: Module[],
    rooms: Room[],
    plants: Plant[]
  ) {
    const modalRef = this.modalService.open(EditBatchDialogComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.reservoirs = reservoirs;
    modalRef.componentInstance.nutrients = nutrients;
    modalRef.componentInstance.modules = modules;
    modalRef.componentInstance.rooms = rooms;
    modalRef.componentInstance.plants = plants;
  }
}
