import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../_services/users.service";
import { ConfirmationDialogService } from "../../_services/dialogs/confirmation-dialog.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  createUserForm: FormGroup;

  constructor(private usersService: UsersService,
              private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    let username = '';
    let password = '';
    let confirmPassword = '';
    let isAdmin = false;

    this.createUserForm = new FormGroup({
      'username': new FormControl(username, Validators.required),
      'password': new FormControl(password, Validators.required),
      'confirmPassword': new FormControl(confirmPassword, Validators.required),
      'isAdmin': new FormControl(isAdmin, Validators.required)
    });

  }

  onSubmitCreateUser() {
    let username = this.createUserForm.value['username'];
    let password = this.createUserForm.value['password'];
    let confirmPassword = this.createUserForm.value['confirmPassword'];
    let isAdmin = this.createUserForm.value['isAdmin'];

    if (username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      alert('Please fill in all fields!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.confirmationDialogService.confirm(
      'Confirm Create User',
      'username: ' + username + '; isAdmin: ' + isAdmin,
    ).then((confirmed) => {
        if(confirmed) {
          this.initForms();

          this.usersService.createUser(username, password, isAdmin);
        }
      }
    );
  }
}
