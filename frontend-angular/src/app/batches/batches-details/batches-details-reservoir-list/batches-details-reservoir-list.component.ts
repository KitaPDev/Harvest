import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../../_models/reservoir.model';
import { BatchesService } from '../../../../_services/batches.service';

@Component({
  selector: 'app-batches-details-reservoir-list',
  templateUrl: './batches-details-reservoir-list.component.html',
  styleUrls: ['./batches-details-reservoir-list.component.css'],
})
export class BatchesDetailsReservoirListComponent implements OnInit {
  @Input() reservoirs: Reservoir[];
  @Input() batchesService: BatchesService;

  constructor() {}

  ngOnInit(): void {}
}
