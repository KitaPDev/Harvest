import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Nutrient } from '../../../../_models/nutrient.model';
import { EditReservoirDialogService } from '../../../../_services/dialogs/edit-reservoir-dialog.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { ReservoirsService } from '../../../../_services/reservoirs.service';

@Component({
  selector: 'app-reservoirs-item',
  templateUrl: './reservoirs-item.component.html',
  styleUrls: ['./reservoirs-item.component.css'],
})
export class ReservoirsItemComponent implements OnInit {
  @Input() reservoir: Reservoir;
  @Input() nutrients: Nutrient[] = [];
  @Input() index: number;
  @Input() reservoirsService: ReservoirsService;
  nutrientLabels = '';

  constructor(
    private editReservoirDialogService: EditReservoirDialogService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    for (let nutrient of this.nutrients) {
      if (this.reservoir.nutrientIDs != null) {
        if (this.reservoir.nutrientIDs.includes(nutrient.nutrientID)) {
          if (
            this.nutrients.indexOf(nutrient) <
            this.reservoir.nutrientIDs.length - 1
          ) {
            this.nutrientLabels =
              this.nutrientLabels + ' ' + nutrient.nutrientLabel + ',';
          } else {
            this.nutrientLabels =
              this.nutrientLabels + ' ' + nutrient.nutrientLabel;
          }
        }
      }
    }
  }

  onEditReservoir() {
    let selectedNutrients: Nutrient[] = [];

    if (this.reservoir.nutrientIDs != null) {
      for (let nutrientID of this.reservoir.nutrientIDs) {
        for (let nutrient of this.nutrients) {
          if (nutrient.nutrientID === nutrientID) {
            selectedNutrients.push(nutrient);
          }
        }
      }
    }

    this.editReservoirDialogService.init(
      this.index,
      this.reservoir.reservoirLabel,
      this.nutrients,
      selectedNutrients
    );
  }

  onDeleteReservoir() {
    this.confirmationDialogService
      .confirm(
        'Confirm Delete Reservoir',
        'Reservoir Label: ' + this.reservoir.reservoirLabel
      )
      .then((confirmed) => {
        if (confirmed) {
          this.reservoirsService.deleteReservoir(this.index);
        }
      });
  }
}
