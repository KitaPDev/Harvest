import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../_models/module.model';
import { BatchesService } from '../../../../_services/batches.service';

@Component({
  selector: 'app-batches-details-module-list',
  templateUrl: './batches-details-module-list.component.html',
  styleUrls: ['./batches-details-module-list.component.css'],
})
export class BatchesDetailsModuleListComponent implements OnInit {
  @Input() modules: Module[];
  @Input() batchesService: BatchesService;

  constructor() {}

  ngOnInit(): void {}
}
