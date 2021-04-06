import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { User } from '../_models/user.model';
import { httpPostOptions } from '../_shared/httpPostOptions';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:9090/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private userService: UsersService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password,
    };

    this.httpClient.post(AUTH_API + '/login', body, httpPostOptions).subscribe(
      (response: HttpResponse<any>) => {
        let currentUser = new User();
        currentUser['userID'] = response.body['user_id'];
        currentUser['username'] = response.body['username'];
        currentUser['isAdmin'] = response.body['is_admin'];

        this.userService.saveUser(currentUser);

        this.router.navigate(['']);
      },
      (error) => {
        console.log(error);
        throwError(error);

        if (error.status === 401) {
          alert('Invalid Credentials!');
        }

        this.router.navigate(['/login']);
      }
    );
  }

  logout() {
    this.httpClient
      .post(AUTH_API + '/logout', httpPostOptions)
      .subscribe((response: HttpResponse<any>) => {
        if (response != undefined) {
          if (response.status === 200) {
            alert('Goodbye!');
          }
        }

        this.router.navigate(['/login']);
      });
  }

  getCurrentUsername(): string {
    return this.userService.getCurrentUser().username;
  }
}
