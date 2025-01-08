import { AppComponent } from './app.component';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
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
        (component) => component.CustomerLoginComponent
      ),
      canActivate: [UnauthorizedGuard]    
  },
  {
    path: 'my-ai-apps',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.MyAiAppsComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'my-ai-apps/data-entry-app',
    loadComponent: () =>
      import('@regio-ki/data-entry-app').then(
        (component) => component.DataEntryAppComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-ai-apps/create-data-entry',
    loadComponent: () =>
      import('@regio-ki/data-entry-app').then(
        (component) => component.DataEntryAppCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-ai-apps/update-data-entry/:id',
    loadComponent: () =>
      import('@regio-ki/data-entry-app').then(
        (component) => component.DataEntryAppCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-ai-apps/:id',
    loadComponent: () =>
      import('@regio-ki/apps-management').then(
        (component) => component.SpecifiedAiAppComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'my-ai-apps',
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
