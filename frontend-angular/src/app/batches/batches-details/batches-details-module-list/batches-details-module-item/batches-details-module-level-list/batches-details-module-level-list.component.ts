import { Component, Input, OnInit } from '@angular/core';
import { BatchesService } from '../../../../../../_services/batches.service';
import { LogSensorModuleLevel } from '../../../../../../_models/logsensormodule.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batches-details-module-level-list',
  templateUrl: './batches-details-module-level-list.component.html',
  styleUrls: ['./batches-details-module-level-list.component.css'],
})
export class BatchesDetailsModuleLevelListComponent implements OnInit {
  @Input() moduleID: number;
  @Input() level: number;

  batchID: number;

  levels = Array(this.level).fill(1);
  logSensorModuleLevels: LogSensorModuleLevel[];

  constructor(
    private batchesService: BatchesService,
    private route: ActivatedRoute
  ) {
    this.batchID = +this.route.snapshot.params['id'];
    batchesService.fetchBatchDetails(this.batchID);
  }

  ngOnInit(): void {
    this.batchesService.recBatchID_BatchDetail.subscribe((batchDetails) => {
      this.logSensorModuleLevels = batchDetails[
        this.batchID
      ].logSensorModuleLevels.filter((log) => log.moduleID === this.moduleID);
    });
  }
}
