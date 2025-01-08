import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthGuard,
  AuthInterceptor,
  ErrorInterceptor,
  UnauthorizedGuard,
} from '@regio-ki/regioki-core';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@regio-ki/auth').then(
        (component) => component.AdminLoginComponent
      ),
    
    canActivate: [UnauthorizedGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@regio-ki/dashboard').then(
        (component) => component.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'customer-management',
    loadComponent: () =>
      import('@regio-ki/customer-management').then(
        (component) => component.CustomerManagementComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'create-customer',
    loadComponent: () =>
      import('@regio-ki/customer-management').then(
        (component) => component.CreateCustomerComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'update-customer/:id',
    loadComponent: () =>
      import('@regio-ki/customer-management').then(
        (component) => component.CreateCustomerComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'view-customer/:id',
    loadComponent: () =>
      import('@regio-ki/customer-management').then(
        (component) => component.CreateCustomerComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'customer-management/:id',
    loadComponent: () =>
      import('@regio-ki/company-user').then(
        (component) => component.CompanyUserComponent
      ),

    canActivate: [AuthGuard],
  },

  {
    path: 'create-company-user',
    loadComponent: () =>
      import('@regio-ki/company-user').then(
        (component) => component.CreateCompanyUserComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'update-company-user/:id',
    loadComponent: () =>
      import('@regio-ki/company-user').then(
        (component) => component.CreateCompanyUserComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'view-company-user/:id',
    loadComponent: () =>
      import('@regio-ki/company-user').then(
        (component) => component.CreateCompanyUserComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'apps-management',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.AppsManagementComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'apps-list',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.AppsManagementComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'app-create',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.AppsCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'app-update/:id',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.AppsCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'app-view/:id',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.AppsCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
