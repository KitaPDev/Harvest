import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogService } from "../../_services/dialogs/confirmation-dialog.service";
import { Reservoir } from "../../_models/reservoir.model";
import { Room } from "../../_models/room.model";
import { ModulesService } from "../../_services/modules.service";

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  createModuleForm: FormGroup;
  rooms: Room[] = [];
  reservoirs: Reservoir[] = [];

  constructor(private modulesService: ModulesService,
              private confirmationDialogService: ConfirmationDialogService) {
    modulesService.updateModulesData();
    modulesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
    modulesService.reservoirs.subscribe((reservoir) => {
      this.reservoirs = reservoir;
    });
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let moduleLabel = '';

    this.createModuleForm = new FormGroup({
      'moduleLabel': new FormControl(moduleLabel, Validators.required),
      'room': new FormControl('', Validators.required),
      'reservoir': new FormControl('', Validators.required),
    });
  }

  onSubmitCreateModule() {
    let moduleLabel = this.createModuleForm.value['moduleLabel'];
    let roomLabel = this.createModuleForm.value['room'];
    let reservoirLabel = this.createModuleForm.value['reservoir'];

    let selectedRoom: Room = new Room();
    let selectedReservoir: Reservoir = new Reservoir();

    if (moduleLabel.length === 0) {
      alert('Please fill in all fields!');
      return;
    }

    for (let room of this.rooms) {
      if (room.roomLabel === roomLabel) {
        selectedRoom = room;
      }
    }

    for (let reservoir of this.reservoirs) {
      if (reservoir.reservoirLabel === reservoirLabel) {
        selectedReservoir = reservoir;
      }
    }

    this.confirmationDialogService.confirm(
      'Confirm Create Module',
      'Module Label: ' + moduleLabel +
      '\nRoom:' + roomLabel +
      '\nReservoir:' + reservoirLabel
    ).then((confirmed) => {
        if (confirmed) {
          this.modulesService.createModule(moduleLabel, selectedRoom.roomID, selectedReservoir.reservoirID);
        }
      }
    );
  }

  updateRoom(e) {
    this.createModuleForm.get('room').setValue(e.target.value, {
      onlySelf: true
    })
  }

  updateReservoir(e) {
    this.createModuleForm.get('reservoir').setValue(e.target.value, {
      onlySelf: true
    })
  }
}
