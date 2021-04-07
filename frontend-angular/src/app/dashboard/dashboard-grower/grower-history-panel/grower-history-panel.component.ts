import { Component, Input, OnInit } from '@angular/core';
import { DashboardGrowerService } from '../../../../_services/dashboard/dashboard-grower.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogSensorRoom } from '../../../../_models/logsensorroom.model';
import { LogSensorReservoir } from '../../../../_models/logsensorreservoir.model';
import { LogSensorModuleLevel } from '../../../../_models/logsensormodulelevel.model';
import { Module } from '../../../../_models/module.model';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Room } from '../../../../_models/room.model';

@Component({
  selector: 'app-grower-history-panel',
  templateUrl: './grower-history-panel.component.html',
  styleUrls: ['./grower-history-panel.component.css'],
})
export class GrowerHistoryPanelComponent implements OnInit {
  @Input() lsRoom: Room[];
  @Input() lsReservoir: Reservoir[];
  @Input() lsModule: Module[];

  growerHistoryForm: FormGroup;

  isUpdateClickedFirstTime: boolean = false;
  isDisplayCharts: boolean = false;

  lsLogSensorRoomHistory: LogSensorRoom[];
  lsLogSensorReservoirHistory: LogSensorReservoir[];
  lsLogSensorModuleLevelHistory: LogSensorModuleLevel[];

  constructor(
    public dashboardGrowerService: DashboardGrowerService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.dashboardGrowerService.lsLogSensorRoomHistory.subscribe(
      (lsLogSensorRoomHistory) => {
        this.lsLogSensorRoomHistory = lsLogSensorRoomHistory;
      }
    );

    this.dashboardGrowerService.lsLogSensorReservoirHistory.subscribe(
      (lsLogSensorReservoirHistory) => {
        this.lsLogSensorReservoirHistory = lsLogSensorReservoirHistory;
      }
    );

    this.dashboardGrowerService.lsLogSensorModuleLevelHistory.subscribe(
      (lsLogSensorModuleLevelHistory) => {
        this.lsLogSensorModuleLevelHistory = lsLogSensorModuleLevelHistory;
      }
    );

    this.initForms();
  }

  initForms() {
    let timezoneOffset = new Date().getTimezoneOffset() * 60000;

    this.growerHistoryForm = new FormGroup({
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
    this.isDisplayCharts = false;

    let timeStampBegin = this.growerHistoryForm.value['timeStampBegin'];
    let timeStampEnd = this.growerHistoryForm.value['timeStampEnd'];

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
            this.dashboardGrowerService.updateGrowerDashboardHistory(
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
