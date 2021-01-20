import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../_models/user.model';
import { UsersService } from '../../../../_services/users.service';
import { ChangePasswordDialogService } from '../../../../_services/dialogs/change-password-dialog.service';
import { ConfirmationDialogService } from '../../../../_services/dialogs/confirmation-dialog.service';

@Component({
  selector: 'app-users-item',
  templateUrl: './users-item.component.html',
  styleUrls: ['./users-item.component.css'],
})
export class UsersItemComponent implements OnInit {
  @Input() user: User;
  @Input() index: number;
  @Input() usersService: UsersService;

  constructor(
    private changePasswordDialogService: ChangePasswordDialogService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {}

  toggleAdmin() {
    this.usersService.toggleAdmin(this.index);
  }

  onChangePassword() {
    this.changePasswordDialogService.init(this.index, this.user.username);
  }

  onDeleteUser() {
    this.confirmationDialogService
      .confirm('Confirm Delete User', 'username: ' + this.user.username)
      .then((confirmed) => {
        if (confirmed) {
          this.usersService.deleteUser(this.index);
        }
      });
  }
}
