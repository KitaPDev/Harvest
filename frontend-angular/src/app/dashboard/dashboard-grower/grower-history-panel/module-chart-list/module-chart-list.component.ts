import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../../_models/module.model';
import { LogSensorModuleLevel } from '../../../../../_models/logsensormodulelevel.model';

@Component({
  selector: 'app-module-chart-list',
  templateUrl: './module-chart-list.component.html',
  styleUrls: ['./module-chart-list.component.css'],
})
export class ModuleChartListComponent implements OnInit {
  @Input() lsModule: Module[];
  @Input() lsModuleLevelSensorLogHistory: LogSensorModuleLevel[];

  moduleID_lsModuleLevelSensorLogHistory: {
    [key: number]: LogSensorModuleLevel[];
  };

  constructor() {}

  ngOnInit(): void {
    for (let log of this.lsModuleLevelSensorLogHistory) {
      if (
        this.moduleID_lsModuleLevelSensorLogHistory[log.moduleID] == undefined
      ) {
        this.moduleID_lsModuleLevelSensorLogHistory[log.moduleID] = [];
      }

      this.moduleID_lsModuleLevelSensorLogHistory[log.moduleID].push(log);
    }
  }

  getLevelsArray(lvl: number) {
    let levels = [];

    for (let i = 0; i < lvl; i++) {
      levels.push(i + 1);
    }

    return levels;
  }
}
