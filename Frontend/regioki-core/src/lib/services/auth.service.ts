import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UtilityService } from '@regio-ki/regioki-core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://your-api-url.com'; // Replace with your API URL
  private tokenKey = 'authToken';
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    utilService: UtilityService
  ) {
    this.apiUrl = utilService.getEnvUrl() + '/auth';
  }

  adminlogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { data }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  customerlogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/login`, { data }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
