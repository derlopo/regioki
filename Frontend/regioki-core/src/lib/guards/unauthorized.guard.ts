import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UnauthorizedGuard implements CanActivate {
    constructor(private _router: Router) { }
    canActivate(): boolean {
      const token = localStorage.getItem('authToken');
      const userDetails = localStorage.getItem('userDetails');
      if (token && userDetails) {
        this._router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
}
