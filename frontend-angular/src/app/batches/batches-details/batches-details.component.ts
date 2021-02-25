import { Component, OnInit } from '@angular/core';
import { Batch } from '../../../_models/batch.model';
import { BatchesService } from '../../../_services/batches.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../_models/module.model';
import { Plant } from '../../../_models/plant.model';
import { Reservoir } from '../../../_models/reservoir.model';
import { Nutrient } from '../../../_models/nutrient.model';
import { Room } from '../../../_models/room.model';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';

@Component({
  selector: 'app-batches-details',
  templateUrl: './batches-details.component.html',
  styleUrls: ['./batches-details.component.css'],
})
export class BatchesDetailsComponent implements OnInit {
  editBatchForm: FormGroup;

  batchID: number = 0;
  batch: Batch;
  modules: Module[] = [];
  plants: Plant[] = [];
  reservoirs: Reservoir[] = [];
  nutrients: Nutrient[] = [];
  rooms: Room[] = [];
  selectedModules: Module[] = [];
  selectedReservoirs: Reservoir[] = [];
  selectedNutrients: Nutrient[] = [];
  selectedRooms: Room[] = [];

  isDataReady: boolean = false;
  isEditMode: boolean = false;

  constructor(
    public batchesService: BatchesService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {
    this.batchID = +this.route.snapshot.params['id'];
    this.batchesService.updateBatchesData();
  }

  ngOnInit(): void {
    this.batchesService.plants.subscribe((plants) => {
      this.plants = plants;
    });

    this.batchesService.modules.subscribe((modules) => {
      this.modules = modules;

      if (modules.length > 0) {
        this.selectedModules = modules.filter((m) =>
          this.batch.moduleIDs.includes(m.moduleID)
        );
      }
    });

    this.batchesService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;

      this.selectedReservoirs = reservoirs.filter((r) =>
        this.batch.reservoirIDs.includes(r.reservoirID)
      );
    });

    this.batchesService.nutrients.subscribe((nutrients) => {
      this.nutrients = nutrients;

      this.selectedNutrients = nutrients.filter((n) =>
        this.batch.nutrientIDs.includes(n.nutrientID)
      );
    });

    this.batchesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;

      this.selectedRooms = rooms.filter((r) =>
        this.batch.roomIDs.includes(r.roomID)
      );
    });

    this.batchesService.batches.subscribe((batches) => {
      if (batches.length > 0) {
        this.setupPage();
      }
    });
  }

  setupPage() {
    this.modules = [];
    this.plants = [];
    this.reservoirs = [];
    this.nutrients = [];
    this.rooms = [];

    this.batchesService.fetchBatchDetails(this.batchID);

    this.batch = this.batchesService.getBatch(this.batchID);
    this.plants = this.batchesService.getPlants();
    this.reservoirs = this.batchesService.getReservoirs();
    this.nutrients = this.batchesService.getNutrients();
    this.modules = this.batchesService.getModules();
    this.rooms = this.batchesService.getRooms();

    for (let module of this.modules) {
      if (
        this.batch.moduleIDs.includes(module.moduleID) &&
        !this.selectedModules.some(
          (selectedModule) => selectedModule.moduleID === module.moduleID
        )
      ) {
        this.selectedModules.push(module);
      }
    }

    for (let room of this.rooms) {
      if (
        this.batch.roomIDs.includes(room.roomID) &&
        !this.selectedRooms.some(
          (selectedRoom) => selectedRoom.roomID === room.roomID
        )
      ) {
        this.selectedRooms.push(room);
      }
    }

    for (let reservoir of this.reservoirs) {
      if (
        this.batch.reservoirIDs.includes(reservoir.reservoirID) &&
        !this.selectedReservoirs.some(
          (selectedReservoir) =>
            selectedReservoir.reservoirID === reservoir.reservoirID
        )
      ) {
        this.selectedReservoirs.push(reservoir);
      }
    }

    for (let nutrient of this.nutrients) {
      if (
        this.batch.nutrientIDs.includes(nutrient.nutrientID) &&
        !this.selectedNutrients.some(
          (selectedNutrient) =>
            selectedNutrient.nutrientID === nutrient.nutrientID
        )
      ) {
        this.selectedNutrients.push(nutrient);
      }
    }

    this.initForms();
  }

  initForms() {
    this.editBatchForm = new FormGroup({
      batchLabel: new FormControl(this.batch.batchLabel, Validators.required),
      plantLabel: new FormControl(this.batch.plantID, Validators.required),
      reservoirLabel: new FormControl([], Validators.required),
      nutrientLabel: new FormControl([], Validators.required),
      moduleLabel: new FormControl([], Validators.required),
      roomLabel: new FormControl([], Validators.required),
      timeStampBegin: new FormControl(
        new Date(
          this.batch.timeStampBegin.getTime() -
            this.batch.timeStampBegin.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),
        [Validators.required]
      ),
      timeStampEnd: new FormControl(
        new Date(
          this.batch.timeStampEnd.getTime() -
            this.batch.timeStampEnd.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),
        [Validators.required]
      ),
      weight: new FormControl(this.batch.weight, [
        Validators.required,
        Validators.min(0),
      ]),
      lightsOnHour: new FormControl(this.batch.lightsOnHour, [
        Validators.required,
        Validators.min(0),
      ]),
      lightsOffHour: new FormControl(this.batch.lightsOffHour, [
        Validators.required,
        Validators.min(0),
      ]),
      mistingOnSecond: new FormControl(this.batch.mistingOnSecond, [
        Validators.required,
        Validators.min(0),
      ]),
      mistingOffSecond: new FormControl(this.batch.mistingOffSecond, [
        Validators.required,
        Validators.min(0),
      ]),
      remarks: new FormControl(this.batch.remarks, Validators.required),
    });

    this.editBatchForm.disable();

    this.isDataReady = true;
  }

  onAddReservoir() {
    let reservoirLabel = this.editBatchForm.value['reservoirLabel'];

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
    if (this.isEditMode === true) {
      for (let reservoir of this.selectedReservoirs) {
        if (reservoir.reservoirLabel === e.target.innerText) {
          this.selectedReservoirs.splice(
            this.selectedReservoirs.indexOf(reservoir),
            1
          );
        }
      }
    }
  }

  updateReservoirs(e) {
    this.editBatchForm.get('reservoirLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedReservoirs(index: number, reservoir: Reservoir) {
    return reservoir.reservoirID;
  }

  onAddNutrient() {
    let nutrientLabel = this.editBatchForm.value['nutrientLabel'];

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
    if (this.isEditMode === true) {
      for (let nutrient of this.selectedNutrients) {
        if (nutrient.nutrientLabel === e.target.innerText) {
          this.selectedNutrients.splice(
            this.selectedNutrients.indexOf(nutrient),
            1
          );
        }
      }
    }
  }

  updateNutrients(e) {
    this.editBatchForm.get('nutrientLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedNutrients(index: number, nutrient: Nutrient) {
    return nutrient.nutrientID;
  }

  onAddModule() {
    let moduleLabel = this.editBatchForm.value['moduleLabel'];

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
    if (this.isEditMode === true) {
      for (let module of this.selectedModules) {
        if (module.moduleLabel === e.target.innerText) {
          this.selectedModules.splice(this.selectedModules.indexOf(module), 1);
        }
      }
    }
  }

  updateModules(e) {
    this.editBatchForm.get('moduleLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedModules(index: number, module: Module) {
    return module.moduleID;
  }

  onAddRoom() {
    let roomLabel = this.editBatchForm.value['roomLabel'];

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
    if (this.isEditMode === true) {
      for (let room of this.selectedRooms) {
        if (room.roomLabel === e.target.innerText) {
          this.selectedRooms.splice(this.selectedRooms.indexOf(room), 1);
        }
      }
    }
  }

  updateRooms(e) {
    this.editBatchForm.get('roomLabel').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  trackSelectedRooms(index: number, room: Room) {
    return room.roomID;
  }

  onSubmitEditBatch() {
    let batchLabel = this.editBatchForm.value['batchLabel'];
    let plantLabel = this.editBatchForm.value['plantLabel'];
    let timeStampBegin = this.editBatchForm.value['timeStampBegin'];
    let timeStampEnd = this.editBatchForm.value['timeStampEnd'];
    let weight = this.editBatchForm.value['weight'];
    let lightsOnHour = this.editBatchForm.value['lightsOnHour'];
    let lightsOffHour = this.editBatchForm.value['lightsOffHour'];
    let mistingOnSecond = this.editBatchForm.value['mistingOnSecond'];
    let mistingOffSecond = this.editBatchForm.value['mistingOffSecond'];
    let remarks = this.editBatchForm.value['remarks'];

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

    this.batch.batchLabel = batchLabel;
    this.batch.plantID = plantID;
    this.batch.reservoirIDs = reservoirIDs;
    this.batch.nutrientIDs = nutrientIDs;
    this.batch.moduleIDs = moduleIDs;
    this.batch.roomIDs = roomIDs;
    this.batch.timeStampBegin = timeStampBegin;
    this.batch.timeStampEnd = timeStampEnd;
    this.batch.weight = weight;
    this.batch.lightsOffHour = lightsOffHour;
    this.batch.lightsOnHour = lightsOnHour;
    this.batch.mistingOffSecond = mistingOffSecond;
    this.batch.mistingOnSecond = mistingOnSecond;
    this.batch.remarks = remarks;

    this.confirmationDialogService
      .confirm(
        'Confirm Edit Batch',
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
          this.batchesService.editBatch(this.batch);
          this.onCancelEditMode();
        }
      });
  }

  onCancelEditMode() {
    this.isEditMode = false;
    this.editBatchForm.disable();
    this.setupPage();
  }

  toEditMode() {
    this.isEditMode = true;
    this.editBatchForm.enable();
  }

  onBackClick() {
    this.router.navigate(['/batches']);
  }
}
