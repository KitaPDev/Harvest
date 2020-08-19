import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../../../_models/module.model';

@Component({
  selector: 'app-batches-details-module-list',
  templateUrl: './batches-details-module-list.component.html',
  styleUrls: ['./batches-details-module-list.component.css'],
})
export class BatchesDetailsModuleListComponent implements OnInit {
  @Input() batchID: number;
  @Input() modules: Module[];

  constructor() {}

  ngOnInit(): void {}
}
