import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogSensorGerminator } from '../../../../_models/logsensorgerminator.model';
import { DashboardGerminatorService } from '../../../../_services/dashboard/dashboard-germinator.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';

@Component({
  selector: 'app-germinator-history-panel',
  templateUrl: './germinator-history-panel.component.html',
  styleUrls: ['./germinator-history-panel.component.css'],
})
export class GerminatorHistoryPanelComponent implements OnInit {
  germinatorHistoryForm: FormGroup;
  lsLogSensorGerminatorHistory: LogSensorGerminator[];

  isUpdateClickedFirstTime: boolean = false;
  isDisplayCharts: boolean = false;

  constructor(
    public dashboardGerminatorService: DashboardGerminatorService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.dashboardGerminatorService.lsLogSensorGerminatorHistory.subscribe(
      (lsLogSensorGerminatorHistory) => {
        if (lsLogSensorGerminatorHistory != undefined) {
          this.lsLogSensorGerminatorHistory = lsLogSensorGerminatorHistory;
        }
      }
    );
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

  onSubmitHistoryPeriod() {
    let timeStampBegin = this.germinatorHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.germinatorHistoryForm.value['timeStampEnd'];

    if (timeStampBegin > timeStampEnd) {
      alert('Time Begin must be before Time End!');
    } else {
      this.confirmationDialogService
        .confirm(
          'Confirm Update History Data',
          'Time Begin: ' +
            new Date(timeStampBegin).toLocaleString('it-IT') +
            ' | Time End: ' +
            new Date(timeStampEnd).toLocaleString('it-IT'),
          'Confirm',
          'Cancel',
          'lg'
        )
        .then((confirmed) => {
          if (confirmed) {
            this.dashboardGerminatorService.updateGerminatorDashboardHistoryData(
              timeStampBegin,
              timeStampEnd
            );
          }

          this.isUpdateClickedFirstTime = true;
          this.isDisplayCharts = true;
        });
    }
  }
}
