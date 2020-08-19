import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../_models/reservoir.model';

@Component({
  selector: 'app-batches-details-reservoir-list',
  templateUrl: './batches-details-reservoir-list.component.html',
  styleUrls: ['./batches-details-reservoir-list.component.css'],
})
export class BatchesDetailsReservoirListComponent implements OnInit {
  @Input() batchID: number;
  @Input() reservoirs: Reservoir[];

  constructor() {}

  ngOnInit(): void {}
}
