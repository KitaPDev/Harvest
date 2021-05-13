import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../_services/dashboard/dashboard-grower.service';
import { Module } from '../../../../../../_models/module.model';
import { ModuleSettings } from '../../../../../../_models/modulesettings.model';
import { LogSensorModuleLevel } from '../../../../../../_models/logsensormodulelevel.model';
import { ConfirmationDialogService } from '../../../../../../_services/dialogs/confirmation-dialog.service';

@Component({
  selector: 'app-grower-module-control-panel-item',
  templateUrl: './grower-module-control-panel-item.component.html',
  styleUrls: ['./grower-module-control-panel-item.component.css'],
})
export class GrowerModuleControlPanelItemComponent implements OnInit {
  @Input() module: Module;
  @Input() dashboardGrowerService: DashboardGrowerService;

  moduleSettings: ModuleSettings = new ModuleSettings();
  lsLogSensorModuleLevel: LogSensorModuleLevel[] = [];

  prevLightsOnHour: number;
  prevLightsOffHour: number;
  prevHumidityRootLow: number;
  prevHumidityRootHigh: number;

  nextLightsOnHour: number;
  nextLightsOffHour: number;
  nextHumidityRootLow: number;
  nextHumidityRootHigh: number;

  constructor(private confirmationDialogService: ConfirmationDialogService) {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsModuleSettings.subscribe(
      (lsModuleSettings) => {
        for (let ms of lsModuleSettings) {
          if (ms.moduleID == this.module.moduleID) {
            this.prevLightsOnHour = ms.lightsOnHour;
            this.prevLightsOffHour = ms.lightsOffHour;
            this.prevHumidityRootLow = ms.humidityRootLow;
            this.prevHumidityRootHigh = ms.humidityRootHigh;

            if (
              JSON.stringify(this.moduleSettings) ==
              JSON.stringify(new ModuleSettings())
            ) {
              this.nextLightsOnHour = this.prevLightsOnHour;
              this.nextLightsOffHour = this.prevLightsOffHour;
              this.nextHumidityRootLow = this.prevHumidityRootLow;
              this.nextHumidityRootHigh = this.prevHumidityRootHigh;
            }

            this.moduleSettings = ms;
            break;
          }
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevel.subscribe(
      (lsLogSensorModuleLevel) => {
        for (let log of lsLogSensorModuleLevel) {
          if (log.moduleID == this.module.moduleID) {
            this.lsLogSensorModuleLevel.push(log);
          }
        }
      }
    );
  }

  onInputEnterKey() {
    this.confirmationDialogService
      .confirm(
        'Confirm Edit Parameters',
        'Lights On hour: ' +
          this.nextLightsOnHour +
          '\nLights off hour:' +
          this.nextLightsOffHour +
          '\nRoot Humidity Low:' +
          this.nextHumidityRootLow +
          '\nRoot Humidity High:' +
          this.nextHumidityRootHigh
      )
      .then((confirmed) => {
        if (confirmed) {
          let moduleSettings = this.moduleSettings;
          moduleSettings.lightsOnHour = this.nextLightsOnHour;
          moduleSettings.lightsOffHour = this.nextLightsOffHour;
          moduleSettings.humidityRootLow = this.nextHumidityRootLow;
          moduleSettings.humidityRootHigh = this.nextHumidityRootHigh;

          this.dashboardGrowerService.updateModuleSettings(moduleSettings).then(
            (success) => {
              if (!success) {
                alert('Unsuccessful!');
              }
            },
            (error) => {
              alert('Unsuccessful!');
            }
          );
        }
      });
  }

  onClickIsAuto() {
    this.moduleSettings.isAuto = (this.moduleSettings.isAuto + 1) % 2;

    this.dashboardGrowerService
      .updateModuleSettings(this.moduleSettings)
      .then((success) => {
        if (!success) {
          alert('Failed to toggle IsAuto');
        }
      });
  }
}
