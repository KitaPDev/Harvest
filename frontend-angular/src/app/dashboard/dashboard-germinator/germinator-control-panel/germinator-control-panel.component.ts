import { Component, OnInit } from '@angular/core';
import { GerminatorSettings } from '../../../../_models/germinatorsettings.model';
import { DashboardGerminatorService } from '../../../../_services/dashboard/dashboard-germinator.service';
import { LogSensorGerminator } from '../../../../_models/logsensorgerminator.model';
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

    this.dashboardGerminatorService.germinatorSettings.subscribe(
      (germinatorSettings: GerminatorSettings) => {
        this.germinatorSettings = germinatorSettings;

        this.prevLightOnTime = germinatorSettings.lightOnTime;
        this.prevLightOffTime = germinatorSettings.lightOffTime;
        this.prevHumidityLow = germinatorSettings.humidityLow;
        this.prevHumidityHigh = germinatorSettings.humidityHigh;

        this.nextLightOnTime = this.prevLightOnTime;
        this.nextLightOffTime = this.prevLightOffTime;
        this.nextHumidityLow = this.prevHumidityLow;
        this.nextHumidityHigh = this.prevHumidityHigh;
      }
    );
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
          let germinatorSettings = new GerminatorSettings();
          germinatorSettings.lightOnTime = this.nextLightOnTime;
          germinatorSettings.lightOffTime = this.nextLightOffTime;
          germinatorSettings.humidityLow = this.nextHumidityLow;
          germinatorSettings.humidityHigh = this.nextHumidityHigh;

          this.dashboardGerminatorService
            .updateGerminatorSettings(germinatorSettings)
            .then(
              (success) => {
                if (!success) {
                  alert('Successful!');
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

  onChangeSettings(settingNumber: number): void {
    switch (settingNumber) {
      case 0:
        this.germinatorSettings.isAuto =
          (this.germinatorSettings.isAuto + 1) % 2;
        break;

      case 1:
        this.germinatorSettings.pump = (this.germinatorSettings.pump + 1) % 2;
        break;

      case 2:
        this.germinatorSettings.led = (this.germinatorSettings.led + 1) % 2;
        break;
    }

    this.dashboardGerminatorService
      .updateGerminatorSettings(this.germinatorSettings)
      .then((success) => {
        if (!success) {
          alert('Unsuccessful');
        }
      });
  }
}
