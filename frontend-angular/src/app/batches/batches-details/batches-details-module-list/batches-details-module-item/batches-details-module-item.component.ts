import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../../_models/module.model';
import { LogSensorModuleLevel } from '../../../../../_models/logsensormodule.model';

@Component({
  selector: 'app-batches-details-module-item',
  templateUrl: './batches-details-module-item.component.html',
  styleUrls: ['./batches-details-module-item.component.css'],
})
export class BatchesDetailsModuleItemComponent implements OnInit {
  @Input() module: Module;
  @Input() logSensorModuleLevels: LogSensorModuleLevel[];

  constructor() {}

  ngOnInit(): void {
    this.logSensorModuleLevels.filter(
      (log) => log.moduleID === this.module.moduleID
    );
  }
}
