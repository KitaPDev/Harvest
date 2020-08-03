import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../../_services/plants.service';
import { Plant } from '../../../_models/plant.model';

@Component({
  selector: 'app-plants-list',
  templateUrl: './plants-list.component.html',
  styleUrls: ['./plants-list.component.css'],
})
export class PlantsListComponent implements OnInit {
  plants: Plant[];

  constructor(private plantsService: PlantsService) {}

  ngOnInit(): void {
    this.plantsService.plants.subscribe((plants: Plant[]) => {
      this.plants = plants;
    });
  }
}
