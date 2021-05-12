import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../../../_services/dashboard/dashboard-grower.service';
import { ModuleSettings } from '../../../../../../../../_models/modulesettings.model';
import { LogSensorModuleLevel } from '../../../../../../../../_models/logsensormodulelevel.model';

@Component({
  selector: 'app-grower-module-level-control-panel-item',
  templateUrl: './grower-module-level-control-panel-item.component.html',
  styleUrls: ['./grower-module-level-control-panel-item.component.css'],
})
export class GrowerModuleLevelControlPanelItemComponent implements OnInit {
  @Input() moduleID: number;
  @Input() level: number;
  @Input() dashboardGrowerService: DashboardGrowerService;

  moduleSettings: ModuleSettings;
  lsLogSensorModuleLevel: LogSensorModuleLevel[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsModuleSettings.subscribe(
      (lsModuleSettings) => {
        for (let ms of lsModuleSettings) {
          if (ms.moduleID == this.moduleID) {
            this.moduleSettings = ms;
          }
        }
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevel.subscribe(
      (lsLogSensorModuleLevel) => {
        for (let log of lsLogSensorModuleLevel) {
          if (log.moduleID == this.moduleID && log.level == this.level) {
            this.lsLogSensorModuleLevel.push(log);
          }
        }
      }
    );
  }

  getModuleTemperatureRoot(): string {
    if (this.lsLogSensorModuleLevel != undefined) {
      for (let log of this.lsLogSensorModuleLevel) {
        if (this.moduleID == log.moduleID && this.level == log.level) {
          return log.temperatureRoot.toString();
        }
      }
    }

    return 'N/A';
  }

  getModuleHumidityRoot(): string {
    if (this.lsLogSensorModuleLevel != undefined) {
      for (let log of this.lsLogSensorModuleLevel) {
        if (this.moduleID == log.moduleID && this.level == log.level) {
          return log.humidityRoot.toString();
        }
      }
    }

    return 'N/A';
  }

  getFanStatus(): number {
    if (this.moduleSettings != undefined) {
      switch (this.level) {
        case 1:
          return this.moduleSettings.fan1;

        case 2:
          return this.moduleSettings.fan2;
      }
    }
  }

  getLedStatus(): number {
    if (this.moduleSettings != undefined) {
      switch (this.level) {
        case 1:
          return this.moduleSettings.led1;

        case 2:
          return this.moduleSettings.led2;
      }
    }
  }

  onClickFan() {
    let tmpModuleSettings = { ...this.moduleSettings };

    switch (this.level) {
      case 1:
        tmpModuleSettings.fan1 = tmpModuleSettings.fan1 == 1 ? 0 : 1;
        break;

      case 2:
        tmpModuleSettings.fan2 = tmpModuleSettings.fan2 == 1 ? 0 : 1;
    }

    this.dashboardGrowerService
      .updateModuleSettings(tmpModuleSettings)
      .then((success) => {
        if (!success) {
          alert('Failed to toggle Fan for Level ' + this.level + '.');
        }
      });
  }

  onClickLed() {
    let tmpModuleSettings = { ...this.moduleSettings };

    switch (this.level) {
      case 1:
        tmpModuleSettings.led1 = tmpModuleSettings.led1 == 1 ? 0 : 1;
        break;

      case 2:
        tmpModuleSettings.led2 = tmpModuleSettings.led2 == 1 ? 0 : 1;
    }

    this.dashboardGrowerService
      .updateModuleSettings(tmpModuleSettings)
      .then((success) => {
        if (!success) {
          alert('Failed to toggle LED for Level ' + this.level + '.');
        }
      });
  }
}
