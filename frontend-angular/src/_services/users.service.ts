import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../_models/user.model';
import { httpPostOptions } from '../_shared/httpPostOptions';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from './dialogs/confirmation-dialog.service';

const USERS_API = `http://localhost:9090/users`;

@Injectable({ providedIn: 'root' })
export class UsersService {
  private usersSource: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );
  users = this.usersSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  saveUser(user: User) {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('current_user'));
  }

  isCurrentUserAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser == undefined) {
      this.router.navigate(['/login']);
    }
    return currentUser.isAdmin;
  }

  createUser(username: string, password: string, isAdmin: boolean) {
    const body = {
      username: username,
      password: password,
      is_admin: isAdmin,
    };

    this.httpClient
      .post(USERS_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateUsersData();
            alert('Successful');
          }

          console.log(response);
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  fetchUsersData(): Promise<any> {
    return this.httpClient.get<any>(USERS_API, httpPostOptions).toPromise();
  }

  toggleAdmin(index: number) {
    const body = {
      user_id: this.usersSource.getValue()[index].userID,
    };

    let isAdmin = this.usersSource.getValue()[index].isAdmin;

    if (isAdmin) {
      this.confirmationDialogService
        .confirm(
          'Confirm Unassign Admin',
          'username: ' + this.usersSource.getValue()[index].username
        )
        .then((confirmed) => {
          if (confirmed) {
            this.httpClient
              .post(USERS_API + '/unassign_admin', body, httpPostOptions)
              .subscribe(
                (response: HttpResponse<any>) => {
                  if (response.status === 200) {
                    alert('Successful');
                  }

                  console.log(response);
                },
                (error) => {
                  throwError(error);
                  alert(error.error);
                }
              );
          }
        });
    } else {
      this.confirmationDialogService
        .confirm(
          'Confirm Assign Admin',
          'username: ' + this.usersSource.getValue()[index].username
        )
        .then((confirmed) => {
          if (confirmed) {
            this.httpClient
              .post(USERS_API + '/assign_admin', body, httpPostOptions)
              .subscribe(
                (response: HttpResponse<any>) => {
                  if (response.status === 200) {
                    alert('Successful');
                  }

                  console.log(response);
                },
                (error) => {
                  throwError(error);
                  alert(error.error);
                }
              );
          }
        });
    }
  }

  changePassword(index: number, oldPassword: string, newPassword: string) {
    const body = {
      user_id: this.usersSource.getValue()[index].userID,
      old_password: oldPassword,
      new_password: newPassword,
    };

    this.httpClient
      .post(USERS_API + '/change_password', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            alert('Successful');
          }

          this.router.navigate(['/users']);
          console.log(response);
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  deleteUser(index: number) {
    const body = {
      user_id: this.usersSource.getValue()[index].userID,
    };

    this.httpClient
      .post(USERS_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateUsersData();
            alert('Successful');
            console.log(this.usersSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateUsersData() {
    this.fetchUsersData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let users: User[] = [];
        for (let data of fetchedData) {
          let user = new User();

          user.userID = data['user_id'];
          user.username = data['username'];
          user.isAdmin = data['is_admin'];
          user.createdAt = data['created_at'];

          users.push(user);
        }

        this.usersSource.next(users);
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }
}
