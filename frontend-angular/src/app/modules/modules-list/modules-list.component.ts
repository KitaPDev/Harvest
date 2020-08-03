import { Component, OnInit } from '@angular/core';
import { Reservoir } from '../../../_models/reservoir.model';
import { Room } from '../../../_models/room.model';
import { ModulesService } from '../../../_services/modules.service';
import { Module } from '../../../_models/module.model';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.css'],
})
export class ModulesListComponent implements OnInit {
  modules: Module[] = [];
  rooms: Room[] = [];
  reservoirs: Reservoir[];

  constructor(private modulesService: ModulesService) {}

  ngOnInit(): void {
    this.modulesService.modules.subscribe((modules: Module[]) => {
      this.modules = modules;
    });
    this.modulesService.reservoirs.subscribe((reservoirs: Reservoir[]) => {
      this.reservoirs = reservoirs;
    });
    this.modulesService.rooms.subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
  }
}
