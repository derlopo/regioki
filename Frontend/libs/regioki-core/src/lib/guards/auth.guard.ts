import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const userDetails = localStorage.getItem('userDetails');

    if (token && userDetails) {
      this._authService.isUserLoggedIn$.next(true);

      return true;
    } else {
      this._authService.logout();
      this._authService.isUserLoggedIn$.next(false);
      return false;
    }
  }
}
