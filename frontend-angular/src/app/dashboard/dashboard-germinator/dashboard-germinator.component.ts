import { Component, OnInit } from '@angular/core';
import { DashboardGerminatorService } from '../../../_services/dashboard/dashboard-germinator.service';
import { LogSensorGerminator } from '../../../_models/logsensorgerminator.model';

@Component({
  selector: 'app-dashboard-germinator',
  templateUrl: './dashboard-germinator.component.html',
  styleUrls: ['./dashboard-germinator.component.css'],
})
export class DashboardGerminatorComponent implements OnInit {
  logSensorGerminators: LogSensorGerminator[];

  constructor(public dashboardGerminatorService: DashboardGerminatorService) {
    dashboardGerminatorService.updateGerminatorDashboard();
    dashboardGerminatorService.logSensorGerminators.subscribe(
      (logSensorGerminators) => {
        this.logSensorGerminators = logSensorGerminators;
      }
    );
  }

  ngOnInit(): void {}
}
