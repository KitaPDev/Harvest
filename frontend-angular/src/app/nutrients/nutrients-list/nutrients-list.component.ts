import { Component, Input, OnInit } from '@angular/core';
import { Nutrient } from '../../../_models/nutrient.model';
import { NutrientsService } from '../../../_services/nutrients.service';

@Component({
  selector: 'app-nutrients-list',
  templateUrl: './nutrients-list.component.html',
  styleUrls: ['./nutrients-list.component.css'],
})
export class NutrientsListComponent implements OnInit {
  @Input() nutrientsService: NutrientsService;

  nutrients: Nutrient[];

  constructor() {}

  ngOnInit(): void {
    this.nutrientsService.nutrients.subscribe((nutrients: Nutrient[]) => {
      this.nutrients = nutrients;
    });
  }
}
