import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleResponseError(error, req, next);
      })
    );
  }

  logout() {
    this.router.navigate(['/login']);
  }

  handleResponseError(error, request?, next?) {
    // Business error
    if (error.status === 400) {
      console.log(`Error Code: ${error.status},  Message: ${error.message}`);
    }

    // Invalid token error
    else if (error.status === 401) {
      this.router.navigate(['/login']);
      throwError(error);
    }

    // Access denied error
    else if (error.status === 403) {
      console.log(`Error Code: ${error.status},  Message: ${error.message}`);
      this.logout();
    }

    // Server error
    else if (error.status === 500) {
      console.log(`Error Code: ${error.status},  Message: ${error.message}`);
    }

    // Maintenance error
    else if (error.status === 503) {
      console.log(`Error Code: ${error.status},  Message: ${error.message}`);
      // Redirect to the maintenance page
    }

    return throwError(error);
  }
}
