import { Component, Input, OnInit } from '@angular/core';
import { Batch } from '../../../../_models/batch.model';
import { Plant } from '../../../../_models/plant.model';
import { BatchesService } from '../../../../_services/batches.service';
import { EditBatchDialogService } from '../../../../_services/dialogs/edit-batch-dialog.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';
import { Module } from '../../../../_models/module.model';
import { Reservoir } from '../../../../_models/reservoir.model';
import { Nutrient } from '../../../../_models/nutrient.model';
import { Room } from '../../../../_models/room.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-batches-item',
  templateUrl: './batches-item.component.html',
  styleUrls: ['./batches-item.component.css'],
})
export class BatchesItemComponent implements OnInit {
  @Input() batch: Batch;
  @Input() modules: Module[] = [];
  @Input() plants: Plant[] = [];
  @Input() reservoirs: Reservoir[] = [];
  @Input() nutrients: Nutrient[] = [];
  @Input() rooms: Room[] = [];

  plant: Plant;

  constructor(
    private batchesService: BatchesService,
    private editBatchDialogService: EditBatchDialogService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    for (let plant of this.plants) {
      if (plant.plantID === this.batch.plantID) {
        this.plant = plant;
      }
    }
  }

  onEditBatch(event: Event) {
    event.stopPropagation();

    this.editBatchDialogService.init(
      this.batch,
      this.reservoirs,
      this.nutrients,
      this.modules,
      this.rooms,
      this.plants
    );
  }

  onDeleteBatch(event: Event) {
    event.stopPropagation();

    this.confirmationDialogService
      .confirm('Confirm Delete Batch', 'Batch Label: ' + this.batch.batchLabel)
      .then((confirmed) => {
        if (confirmed) {
          this.batchesService.deleteBatch(this.batch.batchID);
        }
      });
  }

  onClick() {
    this.router.navigate([this.batch.batchID], {
      relativeTo: this.activatedRoute,
    });
  }
}
