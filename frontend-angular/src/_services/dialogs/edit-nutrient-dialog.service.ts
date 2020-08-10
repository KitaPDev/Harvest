import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditNutrientDialogComponent } from '../../app/_dialogs/edit-nutrient-dialog/edit-nutrient-dialog.component';

@Injectable()
export class EditNutrientDialogService {
  constructor(private modalService: NgbModal) {}

  public init(
    index: number,
    nutrientLabel: string,
    part: number,
    nutrientType: number,
    ccPerLiter: number,
    n: number,
    p: number,
    k: number
  ) {
    const modalRef = this.modalService.open(EditNutrientDialogComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.nutrientLabel = nutrientLabel;
    modalRef.componentInstance.part = part;
    modalRef.componentInstance.nutrientType = nutrientType;
    modalRef.componentInstance.ccPerLiter = ccPerLiter;
    modalRef.componentInstance.n = n;
    modalRef.componentInstance.p = p;
    modalRef.componentInstance.k = k;
  }
}
