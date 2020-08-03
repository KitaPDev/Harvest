import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../_models/reservoir.model';
import { LogSensorReservoir } from '../../../../_models/logsensorreservoir.model';

@Component({
  selector: 'app-batches-details-reservoir-list',
  templateUrl: './batches-details-reservoir-list.component.html',
  styleUrls: ['./batches-details-reservoir-list.component.css'],
})
export class BatchesDetailsReservoirListComponent implements OnInit {
  @Input() reservoirIDs: number[];
  @Input() reservoirs: Reservoir[];
  @Input() logSensorReservoirs: LogSensorReservoir[];

  constructor() {}

  ngOnInit(): void {}
}
