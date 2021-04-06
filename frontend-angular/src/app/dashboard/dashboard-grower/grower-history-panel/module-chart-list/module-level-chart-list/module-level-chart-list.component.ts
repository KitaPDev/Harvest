import { Component, Input, OnInit } from '@angular/core';
import { LogSensorModuleLevel } from '../../../../../../_models/logsensormodulelevel.model';
import { Module } from '../../../../../../_models/module.model';

@Component({
  selector: 'app-module-level-chart-list',
  templateUrl: './module-level-chart-list.component.html',
  styleUrls: ['./module-level-chart-list.component.css'],
})
export class ModuleLevelChartListComponent implements OnInit {
  @Input() levels: [number];
  @Input() lsLogSensorModuleLevelHistory: LogSensorModuleLevel[];

  level_lsModuleLevelSensorLogHistory: {
    [key: number]: LogSensorModuleLevel[];
  } = {};

  constructor() {}

  ngOnInit(): void {
    for (let lvl of this.levels) {
      for (let log of this.lsLogSensorModuleLevelHistory) {
        if (this.level_lsModuleLevelSensorLogHistory[lvl] == undefined) {
          this.level_lsModuleLevelSensorLogHistory[lvl] = [];
        }

        this.level_lsModuleLevelSensorLogHistory[lvl].push(log);
      }
    }
  }
}
