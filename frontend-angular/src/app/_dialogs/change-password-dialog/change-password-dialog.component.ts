import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogService } from "../../../_services/dialogs/confirmation-dialog.service";
import { UsersService } from "../../../_services/users.service";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  changePasswordForm: FormGroup;
  @Input() username: string;
  @Input() index: number

  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private userService: UsersService) { }

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
    let oldPassword = '';
    let newPassword = '';
    let confirmNewPassword = '';

    this.changePasswordForm = new FormGroup({
      'oldPassword': new FormControl(oldPassword, Validators.required),
      'newPassword': new FormControl(newPassword, Validators.required),
      'confirmNewPassword': new FormControl(confirmNewPassword, Validators.required),
    });
  }

  public onSubmitChangePassword() {
    let oldPassword = this.changePasswordForm.value['oldPassword'];
    let newPassword = this.changePasswordForm.value['newPassword'];
    let confirmNewPassword = this.changePasswordForm.value['confirmNewPassword'];

    if (oldPassword.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0) {
      alert('Please fill in all fields!');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.confirmationDialogService.confirm(
      'Confirm Password Change',
      'username: ' + this.username
    ).then((confirmed) => {
        if(confirmed) {
          this.userService.changePassword(this.index, oldPassword, newPassword);
          this.dismiss();
        }
      }
    );
  }
}
