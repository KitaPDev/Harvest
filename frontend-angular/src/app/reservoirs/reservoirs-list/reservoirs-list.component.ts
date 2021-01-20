import { Component, Input, OnInit } from '@angular/core';
import { Reservoir } from '../../../_models/reservoir.model';
import { ReservoirsService } from '../../../_services/reservoirs.service';
import { Nutrient } from '../../../_models/nutrient.model';

@Component({
  selector: 'app-reservoirs-list',
  templateUrl: './reservoirs-list.component.html',
  styleUrls: ['./reservoirs-list.component.css'],
})
export class ReservoirsListComponent implements OnInit {
  @Input() reservoirsService: ReservoirsService;

  reservoirs: Reservoir[] = [];
  nutrients: Nutrient[] = [];

  constructor() {}

  ngOnInit(): void {
    this.reservoirsService.reservoirs.subscribe((reservoirs: Reservoir[]) => {
      this.reservoirs = reservoirs;
    });
    this.reservoirsService.nutrients.subscribe((nutrients: Nutrient[]) => {
      this.nutrients = nutrients;
    });
  }
}
