import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../../_models/reservoir.model';
import { DashboardGrowerService } from '../../../../../_services/dashboard/dashboard-grower.service';

@Component({
  selector: 'app-grower-reservoir-control-panel-list',
  templateUrl: './grower-reservoir-control-panel-list.component.html',
  styleUrls: ['./grower-reservoir-control-panel-list.component.css'],
})
export class GrowerReservoirControlPanelListComponent implements OnInit {
  @Input() lsReservoir: Reservoir[];
  @Input() dashboardGrowerService: DashboardGrowerService;

  constructor() {}

  ngOnInit(): void {}
}
