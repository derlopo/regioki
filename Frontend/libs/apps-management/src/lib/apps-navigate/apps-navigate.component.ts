import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppsService } from '@regio-ki/regioki-core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '@regio-ki/material';
import { AiAppCardComponent } from '@regio-ki/ai-app-card';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-apps-nevigate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AiAppCardComponent,
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>AI Apps</h2>
        <div class="sub-header">
          <mat-form-field class="search-field">
            <mat-icon class="icon-search" matPrefix>search</mat-icon>
            <input
              matInput
              placeholder="Search here..."
              (input)="onSearch($event)"
            />
          </mat-form-field>
          <div class="profile-actions">
            <button mat-flat-button (click)="showCreateAppComponent()">
              Create AI App
            </button>
          </div>
        </div>
      </div>

      <div class="apps-grid">
        <ng-container *ngFor="let app of apps; let i = index">
          <lib-app-card
            [cardDetails]="app"
            (deleteClickedEvent)="onDelete($event)"
            (updatedClickedEvent)="onUpdate($event)"
            (viewClickedEvent)="onView($event)"
          >
          </lib-app-card>
        </ng-container>
      </div>
    </div>
  `,
  styles: `
  .container {
  padding: 16px;
}


::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: #eef9f9 !important;
        border-radius: 32px;
        width: 160%;
        border: 1px solid #D2D2D2 !important;

      }
      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within {
    border: 1px solid #008080 !important;

}
      /* To remove the blue line ripple */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;
      }
      .icon-search{

    margin-top: auto !important;

         color:#008080;
      }
  .sub-header{
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .profile-actions button{
        border-radius: 18px;
        background: #008080;
  }
  }

.apps-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow-y: auto;
}

lib-app-card {
  margin-bottom: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

lib-app-card:hover {
  transform: translateY(-10px);
}

@media (max-width: 768px) {
lib-app-card {
  flex: 1 1 calc(50% - 10px); /* 2 column for small screens */
  }
h2{
font-size:20px;
font-weight:bold;
// margin-right:250px;
}
::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {

        width: 100%;

      }
}
@media (max-width: 600px) {
  .profile-actions{
      width:100%;
      button{
        width:100%;
      }
  }
.search-field{
  margin:auto;
  width:100%;
}
::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {

width: 100%;

}
}
  `,
})
export class AppsNavigateComponent {
  apps = [];
  viewMore = false;

  constructor(
    private appsService: AppsService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {
    this.getAllApps();
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.getAllApps(searchValue);
  }
  searchTextSubject = new Subject<any>();
  getAllApps(searchTerm = '') {
    const query = searchTerm
      ? `populate=*&filters[app_Name][$containsi]=${searchTerm}&sort[id]=asc`
      : `populate=*&sort[id]=asc`;
    this.appsService.findByQuery(query).subscribe({
      next: (res: any) => {
        this.apps = res.data?.map((data: any) => {
          return {
            id: data.id,
            title: data.attributes.app_Name,
            description: data.attributes.app_Description,
            icons: data.attributes.app_Icon,
            isRegioKiSystemApp: data.attributes.isRegioKiSystemApp

          };
        });
      },
      error: (err: any) => {
        console.error('Error creating app:', err);
      },
    });
  }

  showCreateAppComponent() {
    this.router.navigateByUrl('app-create');
  }
  onUpdate(id: any): void {
    // Implement your update logic here
    this.router.navigate([`/app-update/${id}`]);
  }
  onView(id: string): void {
    this.router.navigate([`/app-view/${id}`]);
  }

  onDelete(id: any): void {
    this.appsService.delete(id).subscribe((res: any) => {
      if (res) {
        this._snackbar.open('App Deleted successfully', undefined, {
          duration: 1000,
        });
        this.getAllApps();
      }
    });
  }
}
