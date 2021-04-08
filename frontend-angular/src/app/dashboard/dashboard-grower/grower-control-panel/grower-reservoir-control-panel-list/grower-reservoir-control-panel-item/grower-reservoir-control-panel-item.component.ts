import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../_services/dashboard/dashboard-grower.service';
import { ReservoirSettings } from '../../../../../../_models/reservoirsettings.model';
import { LogSensorReservoir } from '../../../../../../_models/logsensorreservoir.model';
import { Reservoir } from '../../../../../../_models/reservoir.model';

@Component({
  selector: 'app-grower-reservoir-control-panel-item',
  templateUrl: './grower-reservoir-control-panel-item.component.html',
  styleUrls: ['./grower-reservoir-control-panel-item.component.css'],
})
export class GrowerReservoirControlPanelItemComponent implements OnInit {
  @Input() reservoir: Reservoir;
  @Input() dashboardGrowerService: DashboardGrowerService;

  reservoirSettings: ReservoirSettings = new ReservoirSettings();
  logSensorReservoir: LogSensorReservoir = new LogSensorReservoir();

  constructor() {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsReservoirSettings.subscribe(
      (lsReservoirSettings) => {
        for (let rs of lsReservoirSettings) {
          if (rs.reservoirID == this.reservoir.reservoirID) {
            this.reservoirSettings = rs;
          }
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorReservoir.subscribe(
      (lsLogSensorReservoir) => {
        for (let log of lsLogSensorReservoir) {
          if (log.reservoirID == this.reservoir.reservoirID) {
            this.logSensorReservoir = log;
          }
        }
      }
    );
  }

  getTds(): string {
    if (this.logSensorReservoir != undefined) {
      return this.logSensorReservoir.tds.toString();
    }

    return 'N/A';
  }

  getPh(): string {
    if (this.logSensorReservoir != undefined) {
      return this.logSensorReservoir.ph.toString();
    }

    return 'N/A';
  }

  getTemperatureSolution(): string {
    if (this.logSensorReservoir != undefined) {
      return this.logSensorReservoir.temperatureSolution.toString();
    }

    return 'N/A';
  }

  getSolutionLevel(): string {
    if (this.logSensorReservoir != undefined) {
      return this.logSensorReservoir.solnLevel.toString();
    }

    return 'N/A';
  }

  getSvNutrientStatus(): number {
    if (this.reservoirSettings != undefined) {
      return this.reservoirSettings.svNutrient;
    }

    return 0;
  }

  getSvWaterStatus(): number {
    if (this.reservoirSettings != undefined) {
      return this.reservoirSettings.svWater;
    }

    return 0;
  }

  onCLickSvNutrient() {
    if (this.reservoirSettings != undefined) {
      let tmpReservoirSettings = { ...this.reservoirSettings };

      tmpReservoirSettings.svNutrient =
        tmpReservoirSettings.svNutrient == 1 ? 0 : 1;

      this.dashboardGrowerService
        .updateReservoirSettings(tmpReservoirSettings)
        .then((success) => {
          if (!success) {
            alert('Failed to toggle SV Nutrient.');
          }
        });
    }
  }

  onCLickSvWater() {
    if (this.reservoirSettings != undefined) {
      let tmpReservoirSettings = { ...this.reservoirSettings };

      tmpReservoirSettings.svWater = tmpReservoirSettings.svWater == 1 ? 0 : 1;

      this.dashboardGrowerService
        .updateReservoirSettings(tmpReservoirSettings)
        .then((success) => {
          if (!success) {
            alert('Failed to toggle SV Water.');
          }
        });
    }
  }
}
