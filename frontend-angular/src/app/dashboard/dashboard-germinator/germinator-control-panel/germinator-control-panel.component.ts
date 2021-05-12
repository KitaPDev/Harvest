import { Component, OnInit } from '@angular/core';
import { GerminatorSettings } from '../../../../_models/germinatorsettings.model';
import { DashboardGerminatorService } from '../../../../_services/dashboard/dashboard-germinator.service';
import { LogSensorGerminator } from '../../../../_models/logsensorgerminator.model';
import { HttpResponse } from '@angular/common/http';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-germinator-control-panel',
  templateUrl: './germinator-control-panel.component.html',
  styleUrls: ['./germinator-control-panel.component.css'],
})
export class GerminatorControlPanelComponent implements OnInit {
  logSensorGerminator: LogSensorGerminator;
  germinatorSettings: GerminatorSettings = new GerminatorSettings();

  prevLightOnTime: number;
  prevLightOffTime: number;
  prevHumidityLow: number;
  prevHumidityHigh: number;

  nextLightOnTime: number;
  nextLightOffTime: number;
  nextHumidityLow: number;
  nextHumidityHigh: number;

  subRefreshSensor: Subscription;

  constructor(
    private dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dashboardGerminatorService.updateGerminatorDashboard();
    this.subRefreshSensor = interval(2000).subscribe(() => {
      this.dashboardGerminatorService.updateGerminatorDashboard();
    });
    this.dashboardGerminatorService.logSensorGerminator.subscribe(
      (logSensorGerminator) => {
        this.logSensorGerminator = logSensorGerminator;
      }
    );

    this.dashboardGerminatorService
      .getAllGerminatorSettings()
      .then((germinatorSettings: GerminatorSettings) => {
        this.germinatorSettings = germinatorSettings;

        this.prevLightOnTime = germinatorSettings.lightOnTime;
        this.prevLightOffTime = germinatorSettings.lightOffTime;
        this.prevHumidityLow = germinatorSettings.humidityLow;
        this.prevHumidityHigh = germinatorSettings.humidityHigh;

        this.nextLightOnTime = this.prevLightOnTime;
        this.nextLightOffTime = this.prevLightOffTime;
        this.nextHumidityLow = this.prevHumidityLow;
        this.nextHumidityHigh = this.prevHumidityHigh;
      });
  }

  onInputEnterKey() {
    this.confirmationDialogService
      .confirm(
        'Confirm Edit Parameters',
        'Light On hour: ' +
          this.nextLightOnTime +
          '\nLight off hour:' +
          this.nextLightOffTime +
          '\nHumidity Low:' +
          this.nextHumidityLow +
          '\nHumidity High:' +
          this.nextHumidityHigh
      )
      .then((confirmed) => {
        if (confirmed) {
          let gs = new GerminatorSettings();
          gs.lightOnTime = this.nextLightOnTime;
          gs.lightOffTime = this.nextLightOffTime;
          gs.humidityLow = this.nextHumidityLow;
          gs.humidityHigh = this.nextHumidityHigh;

          let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();
          this.dashboardGerminatorService
            .updateGerminatorSettings(gs)
            .subscribe(
              (response: HttpResponse<any>) => {
                let fetchedData = JSON.parse(JSON.stringify(response.body));

                receivedGerminatorSettings.isAuto = fetchedData['is_auto'];
                receivedGerminatorSettings.humidityLow =
                  fetchedData['humidity_low'];
                receivedGerminatorSettings.humidityHigh =
                  fetchedData['humidity_high'];
                receivedGerminatorSettings.lightOnTime =
                  fetchedData['light_on_time'];
                receivedGerminatorSettings.lightOffTime =
                  fetchedData['light_off_time'];
                receivedGerminatorSettings.mister = fetchedData['mister'];
                receivedGerminatorSettings.led = fetchedData['led'];

                if (
                  JSON.stringify(gs) ==
                  JSON.stringify(receivedGerminatorSettings)
                ) {
                  this.prevLightOnTime = this.nextLightOnTime;
                  this.prevLightOffTime = this.nextLightOffTime;
                  this.prevHumidityLow = this.nextHumidityLow;
                  this.prevHumidityHigh = this.nextHumidityHigh;

                  alert('Successful!');
                } else {
                  alert('Unsuccessful!');
                }
              },
              (error) => {
                alert('Unsuccessful!');
              }
            );
        }
      });
  }

  ngOnDestroy(): void {
    this.subRefreshSensor.unsubscribe();
  }

  getIsAuto(): boolean {
    return this.germinatorSettings.isAuto == 1;
  }

  getFanStatus(): boolean {
    return this.germinatorSettings.fan == 1;
  }

  getMisterStatus(): boolean {
    return this.germinatorSettings.mister == 1;
  }

  getLedStatus(): boolean {
    return this.germinatorSettings.led == 1;
  }
}
