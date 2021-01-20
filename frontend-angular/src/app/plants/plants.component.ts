import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogService } from '../../_services/dialogs/confirmation-dialog.service';
import { PlantsService } from '../../_services/plants.service';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.css'],
})
export class PlantsComponent implements OnInit {
  createPlantForm: FormGroup;

  constructor(
    public plantsService: PlantsService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    plantsService.updatePlantsData();
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let plantLabel = '';
    let tdsHigh = 0;
    let tdsLow = 0;
    let phHigh = 0;
    let phLow = 0;
    let temperatureHigh = 0;
    let temperatureLow = 0;
    let lightsOffHour = 0;
    let lightsOnHour = 0;
    let mistingOffSecond = 0;
    let mistingOnSecond = 0;

    this.createPlantForm = new FormGroup({
      plantLabel: new FormControl(plantLabel, Validators.required),
      tdsHigh: new FormControl(tdsHigh, Validators.required),
      tdsLow: new FormControl(tdsLow, Validators.required),
      phHigh: new FormControl(phHigh, Validators.required),
      phLow: new FormControl(phLow, Validators.required),
      temperatureHigh: new FormControl(temperatureHigh, Validators.required),
      temperatureLow: new FormControl(temperatureLow, Validators.required),
      lightsOffHour: new FormControl(lightsOffHour, Validators.required),
      lightsOnHour: new FormControl(lightsOnHour, Validators.required),
      mistingOffSecond: new FormControl(mistingOffSecond, Validators.required),
      mistingOnSecond: new FormControl(mistingOnSecond, Validators.required),
    });
  }

  onSubmitCreatePlant() {
    let plantLabel = this.createPlantForm.value['plantLabel'];
    let tdsHigh = this.createPlantForm.value['tdsHigh'];
    let tdsLow = this.createPlantForm.value['tdsLow'];
    let phHigh = this.createPlantForm.value['phHigh'];
    let phLow = this.createPlantForm.value['phLow'];
    let temperatureHigh = this.createPlantForm.value['temperatureHigh'];
    let temperatureLow = this.createPlantForm.value['temperatureLow'];
    let lightsOffHour = this.createPlantForm.value['lightsOffHour'];
    let lightsOnHour = this.createPlantForm.value['lightsOnHour'];
    let mistingOffSecond = this.createPlantForm.value['mistingOffSecond'];
    let mistingOnSecond = this.createPlantForm.value['mistingOnSecond'];

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
        'Confirm Create Plant',
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
          this.initForms();

          this.plantsService.createPlant(
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
        }
      });
  }
}
