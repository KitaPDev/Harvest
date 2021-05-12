import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { UsersService } from '../../_services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isNavbarVisible = false;
  isToggleExpanded = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private usersService: UsersService
  ) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.isNavbarVisible = e.url !== '/login';
      }
    });
  }

  ngOnInit(): void {}

  toggleNavbar() {
    this.isToggleExpanded = !this.isToggleExpanded;
  }

  isCurrentUserAdmin() {
    return this.usersService.getCurrentUser().isAdmin;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
