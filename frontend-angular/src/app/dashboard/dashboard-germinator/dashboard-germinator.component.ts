import { Component, OnInit } from '@angular/core';
import { DashboardGerminatorService } from '../../../_services/dashboard/dashboard-germinator.service';
import { LogSensorGerminator } from '../../../_models/logsensorgerminator.model';
import { GerminatorSettings } from '../../../_models/germinatorsettings.model';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-germinator',
  templateUrl: './dashboard-germinator.component.html',
  styleUrls: ['./dashboard-germinator.component.css'],
})
export class DashboardGerminatorComponent implements OnInit {
  germinatorHistoryForm: FormGroup;

  logSensorGerminators: LogSensorGerminator[];
  germinatorSettings: GerminatorSettings = new GerminatorSettings();

  prevLightOnTime: number;
  prevLightOffTime: number;
  prevHumidityLow: number;
  prevHumidityHigh: number;

  nextLightOnTime: number;
  nextLightOffTime: number;
  nextHumidityLow: number;
  nextHumidityHigh: number;

  constructor(
    public dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    dashboardGerminatorService.updateGerminatorDashboard();
    dashboardGerminatorService.logSensorGerminators.subscribe(
      (logSensorGerminators) => {
        this.logSensorGerminators = logSensorGerminators;
      }
    );
  }

  ngOnInit(): void {
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

  initForms() {
    let timezoneOffset = new Date().getTimezoneOffset() * 60000;

    this.germinatorHistoryForm = new FormGroup({
      timeStampBegin: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
      timeStampEnd: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
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

  onSubmitHistoryPeriod() {
    let timeStampBegin = this.germinatorHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.germinatorHistoryForm.value['timeStampEnd'];

    this.confirmationDialogService
      .confirm(
        'Confirm Fetch History Data',
        'Time Begin: ' + timeStampBegin + 'Time End: ' + timeStampEnd
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.dashboardGerminatorService.updateGerminatorDashboardHistoryData(
            timeStampBegin,
            timeStampEnd
          );
        }
      });
  }
}
