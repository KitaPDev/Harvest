import { Component, Input, OnInit } from '@angular/core';
import { Batch } from '../../../_models/batch.model';
import { Module } from '../../../_models/module.model';
import { Plant } from '../../../_models/plant.model';
import { Reservoir } from '../../../_models/reservoir.model';
import { Nutrient } from '../../../_models/nutrient.model';
import { Room } from '../../../_models/room.model';
import { BatchesService } from '../../../_services/batches.service';

@Component({
  selector: 'app-batches-list',
  templateUrl: './batches-list.component.html',
  styleUrls: ['./batches-list.component.css'],
})
export class BatchesListComponent implements OnInit {
  @Input() batchesService: BatchesService;

  batches: Batch[] = [];
  modules: Module[] = [];
  plants: Plant[] = [];
  reservoirs: Reservoir[] = [];
  nutrients: Nutrient[] = [];
  rooms: Room[] = [];

  constructor() {}

  ngOnInit(): void {
    this.batchesService.batches.subscribe((batches) => {
      this.batches = batches;
    });
    this.batchesService.modules.subscribe((modules) => {
      this.modules = modules;
    });
    this.batchesService.plants.subscribe((plants) => {
      this.plants = plants;
    });
    this.batchesService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;
    });
    this.batchesService.nutrients.subscribe((nutrients) => {
      this.nutrients = nutrients;
    });
    this.batchesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
  }
}
