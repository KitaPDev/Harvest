import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../../_models/module.model';
import { BatchesService } from '../../../../../_services/batches.service';

@Component({
  selector: 'app-batches-details-module-item',
  templateUrl: './batches-details-module-item.component.html',
  styleUrls: ['./batches-details-module-item.component.css'],
})
export class BatchesDetailsModuleItemComponent implements OnInit {
  @Input() module: Module;
  @Input() batchesService: BatchesService;

  isDisplayDetails: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.isDisplayDetails = !this.isDisplayDetails;
  }
}
