import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../../_models/reservoir.model';
import { LogSensorReservoir } from '../../../../../_models/logsensorreservoir.model';
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-batches-details-reservoir-item',
  templateUrl: './batches-details-reservoir-item.component.html',
  styleUrls: ['./batches-details-reservoir-item.component.css'],
})
export class BatchesDetailsReservoirItemComponent implements OnInit {
  @Input() reservoir: Reservoir;
  @Input() logSensorReservoirs: LogSensorReservoir[];

  constructor() {}

  ngOnInit(): void {
    this.logSensorReservoirs.filter(
      (log) => log.reservoirID === this.reservoir.reservoirID
    );
  }
}
