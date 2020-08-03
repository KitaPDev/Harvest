import { Component, OnInit } from '@angular/core';
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
  batches: Batch[] = [];
  modules: Module[] = [];
  plants: Plant[] = [];
  reservoirs: Reservoir[] = [];
  nutrients: Nutrient[] = [];
  rooms: Room[] = [];

  constructor(private batchesService: BatchesService) {
    batchesService.batches.subscribe((batches) => {
      this.batches = batches;
    });
    batchesService.modules.subscribe((modules) => {
      this.modules = modules;
    });
    batchesService.plants.subscribe((plants) => {
      this.plants = plants;
    });
    batchesService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;
    });
    batchesService.nutrients.subscribe((nutrients) => {
      this.nutrients = nutrients;
    });
    batchesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  ngOnInit(): void {}
}
