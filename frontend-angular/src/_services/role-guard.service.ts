import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UsersService } from "./users.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RoleGuardService implements CanActivate {

  constructor(private userService: UsersService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean
    | UrlTree> | boolean | UrlTree {

    return this.userService.isCurrentUserAdmin();
  }
}
