import { Component, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../_services/dashboard/dashboard-grower.service';
import { Module } from '../../../_models/module.model';
import { Reservoir } from '../../../_models/reservoir.model';
import { Room } from '../../../_models/room.model';

@Component({
  selector: 'app-dashboard-grower',
  templateUrl: './dashboard-grower.component.html',
  styleUrls: ['./dashboard-grower.component.css'],
})
export class DashboardGrowerComponent implements OnInit {
  isDisplayCurrent: boolean = true;

  lsModule: Module[];
  lsReservoir: Reservoir[];
  lsRoom: Room[];

  constructor(public dashboardGrowerService: DashboardGrowerService) {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsModule.subscribe((lsModule) => {
      this.lsModule = lsModule;
    });
    this.dashboardGrowerService.lsReservoir.subscribe((lsReservoir) => {
      this.lsReservoir = lsReservoir;
    });
    this.dashboardGrowerService.lsRoom.subscribe((lsRoom) => {
      this.lsRoom = lsRoom;
    });
  }

  setDisplayMode(mode: number): void {
    this.isDisplayCurrent = mode == 1;
  }
}
