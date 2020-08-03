import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationDialogService } from "../../../../_services/dialogs/confirmation-dialog.service";
import { ModulesService } from "../../../../_services/modules.service";
import { Module } from "../../../../_models/module.model";
import { EditModuleDialogService } from "../../../../_services/dialogs/edit-module-dialog.service";
import { Reservoir } from "../../../../_models/reservoir.model";
import { Room } from "../../../../_models/room.model";

@Component({
  selector: 'app-modules-item',
  templateUrl: './modules-item.component.html',
  styleUrls: ['./modules-item.component.css']
})
export class ModulesItemComponent implements OnInit {
  @Input() module: Module;
  @Input() index: number;

  rooms: Room[] = [];
  reservoirs: Reservoir[] = [];

  room: Room = new Room();
  reservoir: Reservoir = new Reservoir();

  constructor(private modulesService: ModulesService,
              private editModuleDialogService: EditModuleDialogService,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    this.modulesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
    this.modulesService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;
    });

    for (let room of this.rooms) {
      if (room.roomID === this.module.roomID) {
        this.room = room;
        return;
      }
    }

    for (let reservoir of this.reservoirs) {
      if (reservoir.reservoirID === this.module.reservoirID) {
        this.reservoir = reservoir;
        return;
      }
    }
  }

  onEditModule() {
    this.editModuleDialogService.init(this.index, this.module.moduleLabel, this.room, this.reservoir);
  }

  onDeleteModule() {
    this.confirmationDialogService.confirm(
      'Confirm Delete Module',
      'Module Label: ' + this.module.moduleLabel
    ).then((confirmed) => {
        if (confirmed) {
          this.modulesService.deleteModule(this.index);
        }
      }
    );
  }
}

