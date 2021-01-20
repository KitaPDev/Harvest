import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { Plant } from '../../../../_models/plant.model';
import { PlantsService } from '../../../../_services/plants.service';
import { EditPlantDialogService } from '../../../../_services/dialogs/edit-plant-dialog.service';

@Component({
  selector: 'app-plants-item',
  templateUrl: './plants-item.component.html',
  styleUrls: ['./plants-item.component.css'],
})
export class PlantsItemComponent implements OnInit {
  @Input() plant: Plant;
  @Input() index: number;
  @Input() plantsService: PlantsService;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private editPlantDialogService: EditPlantDialogService
  ) {}

  ngOnInit(): void {}

  onEditPlant() {
    this.editPlantDialogService.init(
      this.index,
      this.plant.plantLabel,
      this.plant.tdsHigh,
      this.plant.tdsLow,
      this.plant.phHigh,
      this.plant.phLow,
      this.plant.temperatureHigh,
      this.plant.temperatureLow,
      this.plant.lightsOffHour,
      this.plant.lightsOnHour,
      this.plant.mistingOffSecond,
      this.plant.mistingOnSecond
    );
  }

  onDeletePlant() {
    this.confirmationDialogService
      .confirm(
        'Confirm Delete Plant',
        'Plant Label: ' +
          this.plant.plantLabel +
          '\nTDS: ' +
          `${this.plant.tdsLow} - ${this.plant.tdsHigh} ppm` +
          '\npH: ' +
          `${this.plant.phLow} - ${this.plant.phHigh}` +
          '\nTemperature: ' +
          `${this.plant.temperatureLow} - ${this.plant.temperatureHigh} Celsius` +
          '\nLight Cycle (On/Off): ' +
          `${this.plant.lightsOnHour}/${this.plant.lightsOffHour} hours` +
          '\nMisting Cycle (On/Off): ' +
          `${this.plant.mistingOnSecond}/${this.plant.mistingOffSecond} seconds`
      )
      .then((confirmed) => {
        if (confirmed) {
          this.plantsService.deletePlant(this.index);
        }
      });
  }
}
