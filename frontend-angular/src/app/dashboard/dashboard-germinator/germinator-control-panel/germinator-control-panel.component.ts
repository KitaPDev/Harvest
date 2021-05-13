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

  prevLightsOnHour: number;
  prevLightsOffHour: number;
  prevHumidityLow: number;
  prevHumidityHigh: number;

  nextLightsOnHour: number;
  nextLightsOffHour: number;
  nextHumidityLow: number;
  nextHumidityHigh: number;

  subRefreshSensor: Subscription;

  constructor(
    private dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dashboardGerminatorService.updateGerminatorDashboard();
    this.dashboardGerminatorService.getGerminatorSettings();
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

        this.prevLightsOnHour = germinatorSettings.lightsOnHour;
        this.prevLightsOffHour = germinatorSettings.lightsOffHour;
        this.prevHumidityLow = germinatorSettings.humidityLow;
        this.prevHumidityHigh = germinatorSettings.humidityHigh;

        this.nextLightsOnHour = this.prevLightsOnHour;
        this.nextLightsOffHour = this.prevLightsOffHour;
        this.nextHumidityLow = this.prevHumidityLow;
        this.nextHumidityHigh = this.prevHumidityHigh;
      }
    );
  }

  onInputEnterKey() {
    this.confirmationDialogService
      .confirm(
        'Confirm Edit Parameters',
        'Lights On hour: ' +
          this.nextLightsOnHour +
          '\nLights off hour:' +
          this.nextLightsOffHour +
          '\nHumidity Low:' +
          this.nextHumidityLow +
          '\nHumidity High:' +
          this.nextHumidityHigh
      )
      .then((confirmed) => {
        if (confirmed) {
          let germinatorSettings = this.germinatorSettings;
          germinatorSettings.lightsOnHour = this.nextLightsOnHour;
          germinatorSettings.lightsOffHour = this.nextLightsOffHour;
          germinatorSettings.humidityLow = this.nextHumidityLow;
          germinatorSettings.humidityHigh = this.nextHumidityHigh;

          this.dashboardGerminatorService
            .updateGerminatorSettings(germinatorSettings)
            .then(
              (success) => {
                if (!success) {
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
