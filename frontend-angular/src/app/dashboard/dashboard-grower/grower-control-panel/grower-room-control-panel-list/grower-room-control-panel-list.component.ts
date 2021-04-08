import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../../../../_models/room.model';
import { DashboardGrowerService } from '../../../../../_services/dashboard/dashboard-grower.service';

@Component({
  selector: 'app-grower-room-control-panel-list',
  templateUrl: './grower-room-control-panel-list.component.html',
  styleUrls: ['./grower-room-control-panel-list.component.css'],
})
export class GrowerRoomControlPanelListComponent implements OnInit {
  @Input() lsRoom: Room[];
  @Input() dashboardGrowerService: DashboardGrowerService;

  constructor() {}

  ngOnInit(): void {}
}
