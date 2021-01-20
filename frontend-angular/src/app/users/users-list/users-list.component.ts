import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../../_services/users.service';
import { User } from '../../../_models/user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  @Input() usersService: UsersService;

  users: User[];

  constructor() {}

  ngOnInit(): void {
    this.usersService.users.subscribe((users: User[]) => {
      this.users = users;
    });
  }
}
