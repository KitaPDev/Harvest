import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../_services/dialogs/confirmation-dialog.service';
import { Room } from '../../../_models/room.model';
import { Reservoir } from '../../../_models/reservoir.model';
import { ModulesService } from '../../../_services/modules.service';

@Component({
  selector: 'app-edit-module-dialog',
  templateUrl: './edit-module-dialog.component.html',
  styleUrls: ['./edit-module-dialog.component.css'],
})
export class EditModuleDialogComponent implements OnInit {
  editModuleForm: FormGroup;
  @Input() index: number;
  @Input() moduleLabel: string;
  @Input() level: number;
  @Input() selectedRoom: Room = new Room();
  @Input() selectedReservoir: Reservoir = new Reservoir();

  rooms: Room[] = [];
  reservoirs: Reservoir[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private confirmationDialogService: ConfirmationDialogService,
    private modulesService: ModulesService
  ) {
    this.modulesService.rooms.subscribe((rooms) => {
      this.rooms = rooms;
    });
    this.modulesService.reservoirs.subscribe((reservoirs) => {
      this.reservoirs = reservoirs;
    });
  }

  ngOnInit() {
    this.initForms();
  }

  public cancel() {
    this.activeModal.close(false);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  initForms() {
    this.editModuleForm = new FormGroup({
      moduleLabel: new FormControl(this.moduleLabel, Validators.required),
      level: new FormControl(this.level, [
        Validators.required,
        Validators.min(0),
      ]),
      room: new FormControl(this.selectedRoom.roomLabel, Validators.required),
      reservoir: new FormControl(
        this.selectedReservoir.reservoirLabel,
        Validators.required
      ),
    });
  }

  public onSubmitEditReservoir() {
    let moduleLabel = this.editModuleForm.value['moduleLabel'];
    let level = this.editModuleForm.value['level'];
    let roomLabel = this.editModuleForm.value['room'];
    let reservoirLabel = this.editModuleForm.value['reservoir'];

    if (moduleLabel.length === 0) {
      alert('Please fill in Module Label!');
      return;
    }

    for (let room of this.rooms) {
      if (room.roomLabel === roomLabel) {
        this.selectedRoom = room;
      }
    }

    for (let reservoir of this.reservoirs) {
      if (reservoir.reservoirLabel === reservoirLabel) {
        this.selectedReservoir = reservoir;
      }
    }

    this.confirmationDialogService
      .confirm(
        'Confirm Module Edit',
        'Module Label: ' +
          moduleLabel +
          '\nLevel: ' +
          level +
          '\nRoom:' +
          (this.selectedRoom.roomID !== 0 ? roomLabel : '') +
          '\nReservoir:' +
          (this.selectedReservoir.reservoirID !== 0 ? reservoirLabel : '')
      )
      .then((confirmed) => {
        if (confirmed) {
          this.modulesService.editModule(
            this.index,
            moduleLabel,
            level,
            this.selectedRoom.roomID,
            this.selectedReservoir.reservoirID
          );
          this.dismiss();
        }
      });
  }

  updateRoom(e) {
    this.editModuleForm.get('room').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  updateReservoir(e) {
    this.editModuleForm.get('reservoir').setValue(e.target.value, {
      onlySelf: true,
    });
  }
}
