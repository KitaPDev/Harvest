import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-batches-details-module-level-list',
  templateUrl: './batches-details-module-level-list.component.html',
  styleUrls: ['./batches-details-module-level-list.component.css'],
})
export class BatchesDetailsModuleLevelListComponent implements OnInit {
  @Input() batchID: number;
  @Input() moduleID: number;
  @Input() level: number;

  levels = Array(this.level).fill(1);

  constructor() {}

  ngOnInit(): void {}
}
