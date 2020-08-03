import { Component, Input, OnInit } from '@angular/core';
import { Nutrient } from "../../../../_models/nutrient.model";
import { NutrientsService } from "../../../../_services/nutrients.service";
import { ConfirmationDialogService } from "../../../../_services/dialogs/confirmation-dialog.service";
import { EditNutrientDialogService } from "../../../../_services/dialogs/edit-nutrient-dialog.service";

@Component({
  selector: 'app-nutrients-item',
  templateUrl: './nutrients-item.component.html',
  styleUrls: ['./nutrients-item.component.css']
})
export class NutrientsItemComponent implements OnInit {
  @Input() nutrient: Nutrient;
  @Input() index: number;

  parts: string[];
  nutrientTypes: string[];

  constructor(private nutrientsService: NutrientsService,
              private confirmationDialogService: ConfirmationDialogService,
              private editNutrientDialogService: EditNutrientDialogService) {
  }

  ngOnInit(): void {
    this.parts = this.nutrientsService.getNutrientParts();
    this.nutrientTypes = this.nutrientsService.getNutrientTypes();
  }

  onEditNutrient() {
    this.editNutrientDialogService.init(this.index, this.nutrient.nutrientLabel, this.nutrient.part, this.nutrient.nutrientType,
      this.nutrient.ccPerLiter, this.nutrient.n, this.nutrient.p, this.nutrient.k);
  }

  onDeleteNutrient() {
    this.confirmationDialogService.confirm(
      'Confirm Nutrient Delete',
      'Nutrient Label: ' + this.nutrient.nutrientLabel +
      '\nPart: ' + this.parts[this.nutrient.part-1] +
      '\nNutrient Type: ' + this.nutrientTypes[this.nutrient.nutrientType-1] +
      '\ncc/liter: ' + this.nutrient.ccPerLiter +
      '\nN: ' + this.nutrient.n +
      '\np: ' + this.nutrient.p +
      '\nk: ' + this.nutrient.k
    ).then((confirmed) => {
        if (confirmed) {
          this.nutrientsService.deleteNutrient(this.index);
        }
      }
    );
  }

}
