import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialogService } from "../../../_services/dialogs/confirmation-dialog.service";
import { NutrientsService } from "../../../_services/nutrients.service";

@Component({
  selector: 'app-edit-nutrient-dialog',
  templateUrl: './edit-nutrient-dialog.component.html',
  styleUrls: ['./edit-nutrient-dialog.component.css']
})
export class EditNutrientDialogComponent implements OnInit {
  editNutrientForm: FormGroup;
  parts: string[];
  nutrientTypes: string[];

  @Input() index: number
  @Input() nutrientLabel: string;
  @Input() part: number;
  @Input() nutrientType: number;
  @Input() ccPerLiter: number;
  @Input() n: number;
  @Input() p: number;
  @Input() k: number;

  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private nutrientsService: NutrientsService) {
  }

  ngOnInit() {
    this.parts = this.nutrientsService.getNutrientParts();
    this.nutrientTypes = this.nutrientsService.getNutrientTypes();
    this.initForms();
  }

  public cancel() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  initForms() {
    this.editNutrientForm = new FormGroup({
      'nutrientLabel': new FormControl(this.nutrientLabel, Validators.required),
      'part': new FormControl(this.parts[this.part - 1], Validators.required),
      'nutrientType': new FormControl(this.nutrientTypes[this.nutrientType - 1], Validators.required),
      'ccPerLiter': new FormControl(this.ccPerLiter, Validators.required),
      'n': new FormControl(this.n, Validators.required),
      'p': new FormControl(this.p, Validators.required),
      'k': new FormControl(this.k, Validators.required),
    });
  }

  public onSubmitEditNutrient() {
    let nutrientLabel = this.editNutrientForm.value['nutrientLabel'];
    let part = this.editNutrientForm.value['part'];
    let nutrientType = this.editNutrientForm.value['nutrientType'];
    let ccPerLiter = this.editNutrientForm.value['ccPerLiter'];
    let n = this.editNutrientForm.value['n']
    let p = this.editNutrientForm.value['p']
    let k = this.editNutrientForm.value['k']

    if (nutrientLabel.length === 0 || !this.parts.includes(part) || !this.nutrientTypes.includes(nutrientType) || ccPerLiter <= 0
      || n <= 0 || p <= 0 || k <= 0) {
      alert('Please fill in all fields!');
      return;
    }

    this.confirmationDialogService.confirm(
      'Confirm Nutrient Edit',
      'Nutrient Label: ' + nutrientLabel +
      '\nPart: ' + part +
      '\nNutrient Type: ' + nutrientType +
      '\ncc/liter: ' + ccPerLiter +
      '\nN: ' + n +
      '\np: ' + p +
      '\nk: ' + k
    ).then((confirmed) => {
        if (confirmed) {
          this.nutrientsService.editNutrient(this.index, nutrientLabel, this.parts.indexOf(part) + 1,
            this.nutrientTypes.indexOf(nutrientType) + 1, ccPerLiter, n, p, k);
          this.dismiss();
        }
      }
    );
  }

  changePart(e) {
    this.editNutrientForm.get('part').setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeNutrientType(e) {
    this.editNutrientForm.get('nutrientType').setValue(e.target.value, {
      onlySelf: true
    })
  }
}
