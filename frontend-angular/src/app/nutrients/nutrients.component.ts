import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogService } from '../../_services/dialogs/confirmation-dialog.service';
import { NutrientsService } from '../../_services/nutrients.service';

@Component({
  selector: 'app-nutrients',
  templateUrl: './nutrients.component.html',
  styleUrls: ['./nutrients.component.css'],
})
export class NutrientsComponent implements OnInit {
  createNutrientForm: FormGroup;
  parts: string[];
  nutrientTypes: string[];

  constructor(
    public nutrientsService: NutrientsService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    nutrientsService.updateNutrientsData();
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let nutrientLabel = '';
    let ccPerLiter = 0;
    let n = 0;
    let p = 0;
    let k = 0;

    this.parts = this.nutrientsService.getNutrientParts();
    this.nutrientTypes = this.nutrientsService.getNutrientTypes();

    this.createNutrientForm = new FormGroup({
      nutrientLabel: new FormControl(nutrientLabel, Validators.required),
      part: new FormControl('', Validators.required),
      nutrientType: new FormControl('', Validators.required),
      ccPerLiter: new FormControl(ccPerLiter, Validators.required),
      n: new FormControl(n, Validators.required),
      p: new FormControl(p, Validators.required),
      k: new FormControl(k, Validators.required),
    });
  }

  onSubmitCreateNutrient() {
    let nutrientLabel = this.createNutrientForm.value['nutrientLabel'];
    let part = this.createNutrientForm.value['part'];
    let nutrientType = this.createNutrientForm.value['nutrientType'];
    let ccPerLiter = this.createNutrientForm.value['ccPerLiter'];
    let n = this.createNutrientForm.value['n'];
    let p = this.createNutrientForm.value['p'];
    let k = this.createNutrientForm.value['k'];

    if (
      nutrientLabel.length === 0 ||
      !this.parts.includes(part) ||
      !this.nutrientTypes.includes(nutrientType) ||
      ccPerLiter <= 0 ||
      n <= 0 ||
      p <= 0 ||
      k <= 0
    ) {
      alert('Please fill in all fields!');
      return;
    }

    this.confirmationDialogService
      .confirm(
        'Confirm Create Nutrient',
        'Nutrient Label: ' +
          nutrientLabel +
          '\nPart: ' +
          part +
          '\nNutrient Type: ' +
          nutrientType +
          '\ncc/liter: ' +
          ccPerLiter +
          '\nN: ' +
          n +
          '\np: ' +
          p +
          '\nk: ' +
          k
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.nutrientsService.createNutrient(
            nutrientLabel,
            this.parts.indexOf(part) + 1,
            this.nutrientTypes.indexOf(nutrientType) + 1,
            ccPerLiter,
            n,
            p,
            k
          );
        }
      });
  }

  changePart(e) {
    this.createNutrientForm.get('part').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  changeNutrientType(e) {
    this.createNutrientForm.get('nutrientType').setValue(e.target.value, {
      onlySelf: true,
    });
  }
}
