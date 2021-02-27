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
  @Input() batchesService: BatchesService;

  batchID: number;

  levels = [];

  logSensorModuleLevels: LogSensorModuleLevel[];

  constructor(private route: ActivatedRoute) {
    this.batchID = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    for (let i = 0; i < this.level; i++) {
      this.levels.push(i + 1);
    }

    this.batchesService.recBatchID_BatchDetail.subscribe(
      (recBatchID_BatchDetail) => {
        if (recBatchID_BatchDetail[this.batchID] != undefined) {
          this.logSensorModuleLevels = recBatchID_BatchDetail[
            this.batchID
          ].logSensorModuleLevels.filter(
            (log) => log.moduleID === this.moduleID
          );
        }
      }
    );
  }
}
