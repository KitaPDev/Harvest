import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../../../../_services/dashboard/dashboard-grower.service';

@Component({
  selector: 'app-grower-module-level-control-panel-list',
  templateUrl: './grower-module-level-control-panel-list.component.html',
  styleUrls: ['./grower-module-level-control-panel-list.component.css'],
})
export class GrowerModuleLevelControlPanelListComponent implements OnInit {
  @Input() moduleID: number;
  @Input() level: number;
  @Input() dashboardGrowerService: DashboardGrowerService;

  constructor() {}

  ngOnInit(): void {}

  getLevelsArray() {
    let levels = [];

    for (let i = 0; i < this.level; i++) {
      levels.push(i + 1);
    }

    return levels;
  }
}
