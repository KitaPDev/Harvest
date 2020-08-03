import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../../_services/users.service";
import { User } from "../../../_models/user.model";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[];

  constructor(private userService: UsersService) {
  }

  ngOnInit(): void {
    this.userService.updateUsersData();
    this.userService.users.subscribe((users: User[]) => {
        this.users = users;
      }
    );
  }
}
