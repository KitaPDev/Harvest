import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";
import { EditReservoirDialogComponent } from "../../app/_dialogs/edit-reservoir-dialog/edit-reservoir-dialog.component";
import { Nutrient } from "../../_models/nutrient.model";

@Injectable()
export class EditReservoirDialogService {
  constructor(private modalService: NgbModal) {
  }

  public init(index: number, reservoirLabel: string, nutrients: Nutrient[], selectedNutrients: Nutrient[]) {
    const modalRef = this.modalService.open(EditReservoirDialogComponent);
    modalRef.componentInstance.index = index
    modalRef.componentInstance.reservoirLabel = reservoirLabel;
    modalRef.componentInstance.nutrients = nutrients;
    modalRef.componentInstance.selectedNutrients = selectedNutrients;
  }
}
