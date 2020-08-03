import { Component, OnInit } from '@angular/core';
import { Nutrient } from '../../../_models/nutrient.model';
import { NutrientsService } from '../../../_services/nutrients.service';

@Component({
  selector: 'app-nutrients-list',
  templateUrl: './nutrients-list.component.html',
  styleUrls: ['./nutrients-list.component.css'],
})
export class NutrientsListComponent implements OnInit {
  nutrients: Nutrient[];

  constructor(private nutrientsService: NutrientsService) {}

  ngOnInit(): void {
    this.nutrientsService.nutrients.subscribe((nutrients: Nutrient[]) => {
      this.nutrients = nutrients;
    });
  }
}
