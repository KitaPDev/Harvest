import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Module } from '../../../../_models/module.model';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Room } from '../../../../_models/room.model';
import { DashboardGrowerService } from '../../../../_services/dashboard/dashboard-grower.service';

@Component({
  selector: 'app-grower-control-panel',
  templateUrl: './grower-control-panel.component.html',
  styleUrls: ['./grower-control-panel.component.css'],
})
export class GrowerControlPanelComponent implements OnInit {
  @Input() lsModule: Module[];
  @Input() lsReservoir: Reservoir[];
  @Input() lsRoom: Room[];

  subRefreshSensor: Subscription;
  subRefreshLsReservoirSettings: Subscription;

  constructor(public dashboardGrowerService: DashboardGrowerService) {}

  ngOnInit(): void {
    this.dashboardGrowerService.updateGrowerDashboardCurrent();
    this.subRefreshSensor = interval(2000).subscribe(() => {
      this.dashboardGrowerService.getLatestGrowerSensorLogs();
    });
    // this.subRefreshLsReservoirSettings = interval(4000).subscribe(() => {
    //   this.dashboardGrowerService.getAllReservoirSettings();
    // });
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
    this.subRefreshLsReservoirSettings.unsubscribe();
  }
}
