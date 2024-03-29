import { Component, Input, OnInit } from '@angular/core';
import { LogSensorModuleLevel } from '../../../../../../_models/logsensormodulelevel.model';

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
      if (this.lsLogSensorModuleLevelHistory != undefined) {
        for (let log of this.lsLogSensorModuleLevelHistory) {
          if (this.level_lsModuleLevelSensorLogHistory[lvl] == undefined) {
            this.level_lsModuleLevelSensorLogHistory[lvl] = [];
          }

          this.level_lsModuleLevelSensorLogHistory[lvl].push(log);
        }
      }
    }
  }
}
