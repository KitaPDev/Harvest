import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { PlantsService } from '../../../_services/plants.service';

@Component({
  selector: 'app-edit-plant-dialog',
  templateUrl: './edit-plant-dialog.component.html',
  styleUrls: ['./edit-plant-dialog.component.css'],
})
export class EditPlantDialogComponent implements OnInit {
  editPlantForm: FormGroup;
  @Input() index: number;
  @Input() plantLabel: string;
  @Input() tdsHigh: number;
  @Input() tdsLow: number;
  @Input() phHigh: number;
  @Input() phLow: number;
  @Input() temperatureHigh: number;
  @Input() temperatureLow: number;
  @Input() lightsOnHour: number;
  @Input() lightsOffHour: number;
  @Input() mistingOnSecond: number;
  @Input() mistingOffSecond: number;

  constructor(
    private activeModal: NgbActiveModal,
    private confirmationDialogService: ConfirmationDialogService,
    private plantsService: PlantsService
  ) {}

  ngOnInit() {
    this.initForms();
  }

  cancel() {
    this.activeModal.close(false);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  initForms() {
    this.editPlantForm = new FormGroup({
      plantLabel: new FormControl(this.plantLabel, Validators.required),
      tdsHigh: new FormControl(this.tdsHigh, Validators.required),
      tdsLow: new FormControl(this.tdsLow, Validators.required),
      phHigh: new FormControl(this.phHigh, Validators.required),
      phLow: new FormControl(this.phLow, Validators.required),
      temperatureHigh: new FormControl(
        this.temperatureHigh,
        Validators.required
      ),
      temperatureLow: new FormControl(this.temperatureLow, Validators.required),
      lightsOffHour: new FormControl(this.lightsOffHour, Validators.required),
      lightsOnHour: new FormControl(this.lightsOnHour, Validators.required),
      mistingOffSecond: new FormControl(
        this.mistingOffSecond,
        Validators.required
      ),
      mistingOnSecond: new FormControl(
        this.mistingOnSecond,
        Validators.required
      ),
    });
  }

  onSubmitEditPlant() {
    let plantLabel = this.editPlantForm.value['plantLabel'];
    let tdsHigh = this.editPlantForm.value['tdsHigh'];
    let tdsLow = this.editPlantForm.value['tdsLow'];
    let phHigh = this.editPlantForm.value['phHigh'];
    let phLow = this.editPlantForm.value['phLow'];
    let temperatureHigh = this.editPlantForm.value['temperatureHigh'];
    let temperatureLow = this.editPlantForm.value['temperatureLow'];
    let lightsOffHour = this.editPlantForm.value['lightsOffHour'];
    let lightsOnHour = this.editPlantForm.value['lightsOnHour'];
    let mistingOffSecond = this.editPlantForm.value['mistingOffSecond'];
    let mistingOnSecond = this.editPlantForm.value['mistingOnSecond'];

    if (plantLabel.length === 0) {
      alert('Please fill in Plant Label!');
      return;
    }

    if (
      tdsHigh < 0 ||
      tdsLow < 0 ||
      phHigh < 0 ||
      phLow < 0 ||
      temperatureHigh < 0 ||
      temperatureLow < 0 ||
      lightsOnHour < 0 ||
      lightsOffHour < 0 ||
      mistingOnSecond < 0 ||
      mistingOffSecond < 0
    ) {
      alert('Parameters cannot be negative!');
      return;
    }

    this.confirmationDialogService
      .confirm(
        'Confirm Edit Plant',
        'Plant Label: ' +
          plantLabel +
          '\nTDS: ' +
          `${tdsLow} - ${tdsHigh} ppm` +
          '\npH: ' +
          `${phLow} - ${phHigh}` +
          '\nTemperature: ' +
          `${temperatureLow} - ${temperatureHigh} Celsius` +
          '\nLight Cycle (On/Off): ' +
          `${lightsOnHour}/${lightsOffHour} hours` +
          '\nMisting Cycle (On/Off): ' +
          `${mistingOnSecond}/${mistingOffSecond} seconds`
      )
      .then((confirmed) => {
        if (confirmed) {
          this.plantsService.editPlant(
            this.index,
            plantLabel,
            tdsHigh,
            tdsLow,
            phHigh,
            phLow,
            temperatureHigh,
            temperatureLow,
            lightsOffHour,
            lightsOnHour,
            mistingOffSecond,
            mistingOnSecond
          );
          this.dismiss();
        }
      });
  }
}
