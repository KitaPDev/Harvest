import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../_models/module.model';
import { Plant } from '../../_models/plant.model';
import { Reservoir } from '../../_models/reservoir.model';
import { Nutrient } from '../../_models/nutrient.model';
import { BatchesService } from '../../_services/batches.service';
import { ConfirmationDialogService } from '../../_services/dialogs/confirmation-dialog.service';
import { Room } from '../../_models/room.model';
import { Batch } from '../../_models/batch.model';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css'],
})
export class BatchesComponent implements OnInit {
  createBatchForm: FormGroup;
  modules: Module[] = [];
  plants: Plant[] = [];
  reservoirs: Reservoir[] = [];
  nutrients: Nutrient[] = [];
  rooms: Room[] = [];
  selectedModules: Module[] = [];
  selectedReservoirs: Reservoir[] = [];
  selectedNutrients: Nutrient[] = [];
  selectedRooms: Room[] = [];

  constructor(
    private batchesService: BatchesService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    batchesService.updateBatchesData();
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

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let batchLabel = '';

    let timezoneOffset = new Date().getTimezoneOffset() * 60000;

    let weight = 0;
    let lightsOnHour = 0;
    let lightsOffHour = 0;
    let mistingOnSecond = 0;
    let mistingOffSecond = 0;
    let remarks = '';

    this.selectedModules = [];
    this.selectedReservoirs = [];
    this.selectedNutrients = [];
    this.selectedRooms = [];

    this.createBatchForm = new FormGroup({
      batchLabel: new FormControl(batchLabel, Validators.required),
      plantLabel: new FormControl([], Validators.required),
      reservoirLabel: new FormControl([], Validators.required),
      nutrientLabel: new FormControl([], Validators.required),
      moduleLabel: new FormControl([], Validators.required),
      roomLabel: new FormControl([], Validators.required),
      timeStampBegin: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
      timeStampEnd: new FormControl(
        new Date(Date.now() - timezoneOffset).toISOString().slice(0, 16),
        [Validators.required]
      ),
      weight: new FormControl(weight, [Validators.required, Validators.min(0)]),
      lightsOnHour: new FormControl(lightsOnHour, [
        Validators.required,
        Validators.min(0),
      ]),
      lightsOffHour: new FormControl(lightsOffHour, [
        Validators.required,
        Validators.min(0),
      ]),
      mistingOnSecond: new FormControl(mistingOnSecond, [
        Validators.required,
        Validators.min(0),
      ]),
      mistingOffSecond: new FormControl(mistingOffSecond, [
        Validators.required,
        Validators.min(0),
      ]),
      remarks: new FormControl(remarks, Validators.required),
    });
  }

  onAddReservoir() {
    let reservoirLabel = this.createBatchForm.value['reservoirLabel'];

    if (reservoirLabel.length === 0) {
      alert('Select a proper Reservoir!');
    }

    let reservoir = new Reservoir();
    for (let r of this.reservoirs) {
      if (r.reservoirLabel === reservoirLabel) {
        reservoir = r;
        break;
      }
    }

    if (this.selectedReservoirs.includes(reservoir)) {
      alert('This Reservoir has already been added!');
    } else {
      this.selectedReservoirs.push(
        this.reservoirs.filter((r) => reservoir === r)[0]
      );
    }
  }

  removeReservoir(e) {
    for (let reservoir of this.selectedReservoirs) {
      if (reservoir.reservoirLabel === e.target.innerText) {
        this.selectedReservoirs.splice(
          this.selectedReservoirs.indexOf(reservoir),
          1
        );
      }
    }
  }

  updateReservoirs(e) {
    this.createBatchForm.get('reservoirLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedReservoirs(index: number, reservoir: Reservoir) {
    return reservoir.reservoirID;
  }

  onAddNutrient() {
    let nutrientLabel = this.createBatchForm.value['nutrientLabel'];

    if (nutrientLabel.length === 0) {
      alert('Select a proper Nutrient!');
    }

    let nutrient = new Nutrient();
    for (let n of this.nutrients) {
      if (n.nutrientLabel === nutrientLabel) {
        nutrient = n;
        break;
      }
    }

    if (this.selectedNutrients.includes(nutrient)) {
      alert('This Nutrient has already been added!');
    } else {
      this.selectedNutrients.push(
        this.nutrients.filter((n) => nutrient === n)[0]
      );
    }
  }

  removeNutrient(e) {
    for (let nutrient of this.selectedNutrients) {
      if (nutrient.nutrientLabel === e.target.innerText) {
        this.selectedNutrients.splice(
          this.selectedNutrients.indexOf(nutrient),
          1
        );
      }
    }
  }

  updateNutrients(e) {
    this.createBatchForm.get('nutrientLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedNutrients(index: number, nutrient: Nutrient) {
    return nutrient.nutrientID;
  }

  onAddModule() {
    let moduleLabel = this.createBatchForm.value['moduleLabel'];

    if (moduleLabel.length === 0) {
      alert('Select a proper Module!');
    }

    let module = new Module();
    for (let m of this.modules) {
      if (m.moduleLabel === moduleLabel) {
        module = m;
        break;
      }
    }

    if (this.selectedModules.includes(module)) {
      alert('This Module has already been added!');
    } else {
      this.selectedModules.push(this.modules.filter((m) => module === m)[0]);
    }
  }

  removeModule(e) {
    for (let module of this.selectedModules) {
      if (module.moduleLabel === e.target.innerText) {
        this.selectedModules.splice(this.selectedModules.indexOf(module), 1);
      }
    }
  }

  updateModules(e) {
    this.createBatchForm.get('moduleLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedModules(index: number, module: Module) {
    return module.moduleID;
  }

  onAddRoom() {
    let roomLabel = this.createBatchForm.value['roomLabel'];

    if (roomLabel.length === 0) {
      alert('Select a proper Room!');
    }

    let room = new Room();
    for (let r of this.rooms) {
      if (r.roomLabel === roomLabel) {
        room = r;
        break;
      }
    }

    if (this.selectedRooms.includes(room)) {
      alert('This Room has already been added!');
    } else {
      this.selectedRooms.push(this.rooms.filter((r) => room === r)[0]);
    }
  }

  removeRoom(e) {
    for (let room of this.selectedRooms) {
      if (room.roomLabel === e.target.innerText) {
        this.selectedRooms.splice(this.selectedRooms.indexOf(room), 1);
      }
    }
  }

  updateRooms(e) {
    this.createBatchForm.get('roomLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedRooms(index: number, room: Room) {
    return room.roomID;
  }

  onSubmitCreateBatch() {
    let batchLabel = this.createBatchForm.value['batchLabel'];
    let plantLabel = this.createBatchForm.value['plantLabel'];
    let timeStampBegin = this.createBatchForm.value['timeStampBegin'];
    let timeStampEnd = this.createBatchForm.value['timeStampEnd'];
    let weight = this.createBatchForm.value['weight'];
    let lightsOnHour = this.createBatchForm.value['lightsOnHour'];
    let lightsOffHour = this.createBatchForm.value['lightsOffHour'];
    let mistingOnSecond = this.createBatchForm.value['mistingOnSecond'];
    let mistingOffSecond = this.createBatchForm.value['mistingOffSecond'];
    let remarks = this.createBatchForm.value['remarks'];

    let plantID = 0;

    for (let plant of this.plants) {
      if (plant.plantLabel === plantLabel) {
        plantID = plant.plantID;
      }
    }

    if (batchLabel.length === 0) {
      alert('Please fill in Batch Label!');
      return;
    }

    if (plantLabel.length === 0) {
      alert('Please select a Plant!');
      return;
    }

    if (
      this.selectedModules.length === 0 ||
      this.selectedRooms.length === 0 ||
      this.selectedReservoirs.length === 0 ||
      this.selectedNutrients.length === 0
    ) {
      alert('Please select at least 1 Module, Room, Reservoir, and Nutrient!');
      return;
    }

    let moduleIDs: number[] = [];
    let reservoirIDs: number[] = [];
    let nutrientIDs: number[] = [];
    let roomIDs: number[] = [];

    let moduleLabels = '';
    let reservoirLabels = '';
    let nutrientLabels = '';
    let roomLabels = '';

    for (let module of this.selectedModules) {
      if (module.moduleID > 0) {
        moduleIDs.push(module.moduleID);
      }

      if (
        this.selectedModules.indexOf(module) <
        this.selectedModules.length - 1
      ) {
        moduleLabels = moduleLabels + ' ' + module.moduleLabel + ',';
      } else {
        moduleLabels = moduleLabels + ' ' + module.moduleLabel;
      }
    }

    for (let reservoir of this.selectedReservoirs) {
      if (reservoir.reservoirID > 0) {
        reservoirIDs.push(reservoir.reservoirID);
      }

      if (
        this.selectedReservoirs.indexOf(reservoir) <
        this.selectedReservoirs.length - 1
      ) {
        reservoirLabels =
          reservoirLabels + ' ' + reservoir.reservoirLabel + ',';
      } else {
        reservoirLabels = reservoirLabels + ' ' + reservoir.reservoirLabel;
      }
    }

    for (let nutrient of this.selectedNutrients) {
      if (nutrient.nutrientID > 0) {
        nutrientIDs.push(nutrient.nutrientID);
      }

      if (
        this.selectedNutrients.indexOf(nutrient) <
        this.selectedNutrients.length - 1
      ) {
        nutrientLabels = nutrientLabels + ' ' + nutrient.nutrientLabel + ',';
      } else {
        nutrientLabels = nutrientLabels + ' ' + nutrient.nutrientLabel;
      }
    }

    for (let room of this.selectedRooms) {
      if (room.roomID > 0) {
        roomIDs.push(room.roomID);
      }

      if (this.selectedRooms.indexOf(room) < this.selectedRooms.length - 1) {
        roomLabels = roomLabels + ' ' + room.roomLabel + ',';
      } else {
        roomLabels = roomLabels + ' ' + room.roomLabel;
      }
    }

    let batch = new Batch();
    batch.batchLabel = batchLabel;
    batch.plantID = plantID;
    batch.reservoirIDs = reservoirIDs;
    batch.nutrientIDs = nutrientIDs;
    batch.moduleIDs = moduleIDs;
    batch.roomIDs = roomIDs;
    batch.timeStampBegin = timeStampBegin;
    batch.timeStampEnd = timeStampEnd;
    batch.weight = weight;
    batch.lightsOffHour = lightsOffHour;
    batch.lightsOnHour = lightsOnHour;
    batch.mistingOffSecond = mistingOffSecond;
    batch.mistingOnSecond = mistingOnSecond;
    batch.remarks = remarks;

    this.confirmationDialogService
      .confirm(
        'Confirm Create Batch',
        'Batch Label: ' +
          batchLabel +
          'Plant Label: ' +
          plantLabel +
          '\nModules: ' +
          moduleLabels +
          '\nRooms: ' +
          roomLabels +
          '\nReservoirs: ' +
          reservoirLabels +
          '\nNutrients: ' +
          nutrientLabels
      )
      .then((confirmed) => {
        if (confirmed) {
          this.initForms();
          this.batchesService.createBatch(batch);
        }
      });
  }
}
