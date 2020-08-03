import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../_services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isNavbarVisible = false;
  isToggleExpanded = false;

  constructor(private router: Router,
              private authService: AuthService) {
    router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.isNavbarVisible = e.url !== '/login';
        }
      });
  }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.isToggleExpanded = !this.isToggleExpanded;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
