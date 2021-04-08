import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../_services/dashboard/dashboard-grower.service';
import { Module } from '../../../../../../_models/module.model';
import { ModuleSettings } from '../../../../../../_models/modulesettings.model';
import { LogSensorModuleLevel } from '../../../../../../_models/logsensormodulelevel.model';

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

  constructor() {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsModuleSettings.subscribe(
      (lsModuleSettings) => {
        for (let ms of lsModuleSettings) {
          if (ms.moduleID == this.module.moduleID) {
            this.moduleSettings = ms;
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

  onClickIsAuto() {
    let tmpModuleSettings = { ...this.moduleSettings };
    tmpModuleSettings.isAuto = tmpModuleSettings.isAuto == 1 ? 0 : 1;

    this.dashboardGrowerService
      .updateModuleSettings(tmpModuleSettings)
      .then((success) => {
        if (!success) {
          alert('Failed to toggle IsAuto');
        }
      });
  }
}
