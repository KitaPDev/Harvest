import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../_models/module.model';
import { LogSensorModuleLevel } from '../../../../_models/logsensormodulelevel.model';

@Component({
  selector: 'app-batches-details-module-list',
  templateUrl: './batches-details-module-list.component.html',
  styleUrls: ['./batches-details-module-list.component.css'],
})
export class BatchesDetailsModuleListComponent implements OnInit {
  @Input() moduleIDs: number[];
  @Input() modules: Module[];
  @Input() logSensorModules: LogSensorModuleLevel[];

  constructor() {}

  ngOnInit(): void {}
}
