import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPlantDialogComponent } from '../../app/_dialogs/edit-plant-dialog/edit-plant-dialog.component';

@Injectable()
export class EditPlantDialogService {
  constructor(private modalService: NgbModal) {}

  public init(
    index: number,
    plantLabel: string,
    tdsHigh: number,
    tdsLow: number,
    phHigh: number,
    phLow: number,
    temperatureHigh: number,
    temperatureLow: number,
    lightsOffHour: number,
    lightsOnHour: number,
    mistingOffSecond: number,
    mistingOnSecond: number
  ) {
    const modalRef = this.modalService.open(EditPlantDialogComponent, {
      size: 'xl',
      backdrop: 'static',
    });
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.plantLabel = plantLabel;
    modalRef.componentInstance.tdsHigh = tdsHigh;
    modalRef.componentInstance.tdsLow = tdsLow;
    modalRef.componentInstance.phHigh = phHigh;
    modalRef.componentInstance.phLow = phLow;
    modalRef.componentInstance.temperatureHigh = temperatureHigh;
    modalRef.componentInstance.temperatureLow = temperatureLow;
    modalRef.componentInstance.lightsOffHour = lightsOffHour;
    modalRef.componentInstance.lightsOnHour = lightsOnHour;
    modalRef.componentInstance.mistingOffSecond = mistingOffSecond;
    modalRef.componentInstance.mistingOnSecond = mistingOnSecond;
  }
}
