import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogService } from '../../_services/dialogs/confirmation-dialog.service';
import { ReservoirsService } from '../../_services/reservoirs.service';
import { Nutrient } from '../../_models/nutrient.model';

@Component({
  selector: 'app-reservoirs',
  templateUrl: './reservoirs.component.html',
  styleUrls: ['./reservoirs.component.css'],
})
export class ReservoirsComponent implements OnInit {
  createReservoirForm: FormGroup;
  nutrients: Nutrient[] = [];
  selectedNutrients: Nutrient[] = [];

  constructor(
    private reservoirsService: ReservoirsService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    reservoirsService.updateReservoirsData();
    reservoirsService.nutrients.subscribe((nutrients) => {
      this.nutrients = nutrients;
    });
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let reservoirLabel = '';

    this.createReservoirForm = new FormGroup({
      reservoirLabel: new FormControl(reservoirLabel, Validators.required),
      nutrientLabel: new FormControl([], Validators.required),
    });
  }

  onAddNutrient() {
    let nutrientLabel = this.createReservoirForm.value['nutrientLabel'];

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

  removeNutrient(e) {
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
    this.createReservoirForm.get('nutrient').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackByNutrientID(index: number, nutrient: Nutrient) {
    return nutrient.nutrientID;
  }

  onSubmitCreateReservoir() {
    let reservoirLabel = this.createReservoirForm.value['reservoirLabel'];

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
        'Confirm Create Reservoir',
        'Reservoir Label: ' + reservoirLabel + '\nNutrients:' + nutrientLabels
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.reservoirsService.createReservoir(reservoirLabel, nutrientIDs);
        }
      });
  }
}
