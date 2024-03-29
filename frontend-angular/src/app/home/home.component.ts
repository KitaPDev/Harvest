import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { UsersService } from '../../_services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  isCurrentUserAdmin(): boolean {
    return this.usersService.getCurrentUser().isAdmin;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
