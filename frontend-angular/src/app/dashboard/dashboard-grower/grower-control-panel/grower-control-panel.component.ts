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

  constructor(public dashboardGrowerService: DashboardGrowerService) {}

  ngOnInit(): void {
    this.dashboardGrowerService.updateGrowerDashboardCurrent();
    this.subRefreshSensor = interval(2000).subscribe(() => {
      this.dashboardGrowerService.getLatestGrowerSensorLogs();
    });

    this.dashboardGrowerService.getAllReservoirSettings();
    this.dashboardGrowerService.getAllModuleSettings();
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
  }

  // onInputEnterKeyModule(moduleID: number, level: number) {
  //   this.confirmationDialogService
  //     .confirm(
  //       'Confirm Edit Parameters',
  //       'Light On hour: ' +
  //       this.nextLightOnTime +
  //       '\nLight off hour:' +
  //       this.nextLightOffTime +
  //       '\nRoot Humidity Low:' +
  //       this.nextHumidityLow +
  //       '\nRoot Humidity High:' +
  //       this.nextHumidityHigh
  //     )
  //     .then((confirmed) => {
  //       if (confirmed) {
  //         let gs = new GerminatorSettings();
  //         gs.lightOnTime = this.nextLightOnTime;
  //         gs.lightOffTime = this.nextLightOffTime;
  //         gs.humidityLow = this.nextHumidityLow;
  //         gs.humidityHigh = this.nextHumidityHigh;
  //
  //         let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();
  //         this.dashboardGerminatorService
  //           .updateGerminatorSettings(gs)
  //           .subscribe(
  //             (response: HttpResponse<any>) => {
  //               let fetchedData = JSON.parse(JSON.stringify(response.body));
  //
  //               receivedGerminatorSettings.isAuto = fetchedData['is_auto'];
  //               receivedGerminatorSettings.humidityLow =
  //                 fetchedData['humidity_low'];
  //               receivedGerminatorSettings.humidityHigh =
  //                 fetchedData['humidity_high'];
  //               receivedGerminatorSettings.lightOnTime =
  //                 fetchedData['light_on_time'];
  //               receivedGerminatorSettings.lightOffTime =
  //                 fetchedData['light_off_time'];
  //               receivedGerminatorSettings.mister = fetchedData['mister'];
  //               receivedGerminatorSettings.led = fetchedData['led'];
  //
  //               if (
  //                 JSON.stringify(gs) ==
  //                 JSON.stringify(receivedGerminatorSettings)
  //               ) {
  //                 this.prevLightOnTime = this.nextLightOnTime;
  //                 this.prevLightOffTime = this.nextLightOffTime;
  //                 this.prevHumidityLow = this.nextHumidityLow;
  //                 this.prevHumidityHigh = this.nextHumidityHigh;
  //
  //                 alert('Successful!');
  //               } else {
  //                 alert('Unsuccessful!');
  //               }
  //             },
  //             (error) => {
  //               alert('Unsuccessful!');
  //             }
  //           );
  //       }
  //     });
  // }
}
