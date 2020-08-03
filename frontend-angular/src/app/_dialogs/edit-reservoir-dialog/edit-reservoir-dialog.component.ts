import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Nutrient } from '../../../_models/nutrient.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { ReservoirsService } from '../../../_services/reservoirs.service';

@Component({
  selector: 'app-edit-reservoir-dialog',
  templateUrl: './edit-reservoir-dialog.component.html',
  styleUrls: ['./edit-reservoir-dialog.component.css'],
})
export class EditReservoirDialogComponent implements OnInit {
  editReservoirForm: FormGroup;
  @Input() index: number;
  @Input() reservoirLabel: string;
  @Input() nutrients: Nutrient[];

  selectedNutrients: Nutrient[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private confirmationDialogService: ConfirmationDialogService,
    private reservoirsService: ReservoirsService
  ) {}

  ngOnInit() {
    this.initForms();
  }

  public cancel() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  initForms() {
    this.editReservoirForm = new FormGroup({
      reservoirLabel: new FormControl(this.reservoirLabel, Validators.required),
      nutrientLabel: new FormControl([], Validators.required),
    });
  }

  onAddNutrient() {
    let nutrientLabel = this.editReservoirForm.value['nutrientLabel'];

    if (nutrientLabel.length === 0) {
      alert('Select a proper Nutrient!');
    }

    let nutrient = new Nutrient();
    for (let n of this.nutrients) {
      if (n.nutrientLabel === nutrientLabel) {
        nutrient = n;
        break;
      }
    }

    if (this.selectedNutrients.includes(nutrient)) {
      alert('This Nutrient has already been added!');
    } else {
      this.selectedNutrients.push(
        this.nutrients.filter((n) => nutrient === n)[0]
      );
    }
  }

  onRemoveNutrient(e) {
    for (let nutrient of this.selectedNutrients) {
      if (nutrient.nutrientLabel === e.target.innerText) {
        this.selectedNutrients.splice(
          this.selectedNutrients.indexOf(nutrient),
          1
        );
      }
    }
  }

  updateNutrients(e) {
    this.editReservoirForm.get('nutrient').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackByNutrientID(index: number, nutrient: Nutrient) {
    return nutrient.nutrientID;
  }

  onSubmitEditReservoir() {
    let reservoirLabel = this.editReservoirForm.value['reservoirLabel'];

    if (reservoirLabel.length === 0) {
      alert('Please fill in Reservoir Label!');
      return;
    }

    let nutrientIDs: number[] = [];
    let nutrientLabels = '';
    for (let nutrient of this.selectedNutrients) {
      if (nutrient.nutrientID > 0) {
        nutrientIDs.push(nutrient.nutrientID);
      }

      if (
        this.selectedNutrients.indexOf(nutrient) <
        this.selectedNutrients.length - 1
      ) {
        nutrientLabels = nutrientLabels + ' ' + nutrient.nutrientLabel + ',';
      } else {
        nutrientLabels = nutrientLabels + ' ' + nutrient.nutrientLabel;
      }
    }

    this.confirmationDialogService
      .confirm(
        'Confirm Reservoir Edit',
        'Reservoir Label: ' +
          this.reservoirLabel +
          '\nNutrients:' +
          nutrientLabels
      )
      .then((confirmed) => {
        if (confirmed) {
          this.reservoirsService.editReservoir(
            this.index,
            reservoirLabel,
            nutrientIDs
          );
          this.dismiss();
        }
      });
  }
}
