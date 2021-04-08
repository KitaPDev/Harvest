import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../../_models/module.model';
import { DashboardGrowerService } from '../../../../../_services/dashboard/dashboard-grower.service';

@Component({
  selector: 'app-grower-module-control-panel-list',
  templateUrl: './grower-module-control-panel-list.component.html',
  styleUrls: ['./grower-module-control-panel-list.component.css'],
})
export class GrowerModuleControlPanelListComponent implements OnInit {
  @Input() lsModule: Module[];
  @Input() dashboardGrowerService: DashboardGrowerService;

  constructor() {}

  ngOnInit(): void {}
}
