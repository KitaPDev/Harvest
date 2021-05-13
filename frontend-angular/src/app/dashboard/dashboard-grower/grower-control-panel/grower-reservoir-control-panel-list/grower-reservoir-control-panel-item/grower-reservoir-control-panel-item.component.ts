import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../_services/dashboard/dashboard-grower.service';
import { ReservoirSettings } from '../../../../../../_models/reservoirsettings.model';
import { LogSensorReservoir } from '../../../../../../_models/logsensorreservoir.model';
import { Reservoir } from '../../../../../../_models/reservoir.model';
import { Subscription } from 'rxjs';

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

  subRefreshSensor: Subscription;

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
      if (this.logSensorReservoir.tds != undefined) {
        return this.logSensorReservoir.tds.toString();
      }
    }

    return 'N/A';
  }

  getPh(): string {
    if (this.logSensorReservoir != undefined) {
      if (this.logSensorReservoir.ph != undefined) {
        return this.logSensorReservoir.ph.toString();
      }
    }

    return 'N/A';
  }

  getTemperatureSolution(): string {
    if (this.logSensorReservoir != undefined) {
      if (this.logSensorReservoir.temperatureSolution != undefined) {
        return this.logSensorReservoir.temperatureSolution.toString();
      }
    }

    return 'N/A';
  }

  onChangeSettings(settingNumber: number): void {
    switch (settingNumber) {
      case 0:
        this.reservoirSettings.svNutrient =
          (this.reservoirSettings.svNutrient + 1) % 2;
        break;

      case 1:
        this.reservoirSettings.svWater =
          (this.reservoirSettings.svWater + 1) % 2;
        break;
    }

    this.dashboardGrowerService
      .updateReservoirSettings(this.reservoirSettings)
      .then((success) => {
        if (!success) {
          alert('Unsuccessful');
        }
      });
  }
}
