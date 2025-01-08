import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@regio-ki/material';
import { AiAppCardComponent } from '@regio-ki/ai-app-card';
import { Router } from '@angular/router';
import { AppsService, UtilityService } from '@regio-ki/regioki-core';
import { IApp } from 'libs/regioki-core/src/lib/models/interfaces';
import { REGIOKI_SYSTEM_APPS_Enum } from 'libs/regioki-core/src/lib/models/enum';
import { environment } from '@env/environment';
@Component({
  selector: 'lib-my-ai-apps',
  standalone: true,
  imports: [CommonModule, MaterialModule, AiAppCardComponent],
  template: `
    <div class="container">
      <div class="header">
        <h2>{{ 'My AI Apps' }}</h2>
        <div class="sub-header">
          <mat-form-field class="search-field">
            <mat-icon class="icon-search" matPrefix>search</mat-icon>
            <input
              matInput
              placeholder="Search here..."
              (input)="onSearch($event)"
            />
          </mat-form-field>
        </div>
      </div>

      <div *ngIf="isAsyncCall; else content" class="spinner-container">
        <mat-spinner></mat-spinner>
      </div>

      <ng-template #content>
        <div class="apps-grid" *ngIf="allApps.length; else noApps">
          <ng-container *ngFor="let app of apps; let i = index">
            <lib-app-card
              [showMenuOptions]="false"
              [cardDetails]="app"
              (click)="navigateToProductUseCase(app)"
              style="cursor: pointer;"
            >
            </lib-app-card>
          </ng-container>
        </div>
        <ng-template #noApps>
          <div class="product-usecase">
            <h3>Get Started!</h3>
            <p>New Feature Coming Soon</p>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: `
    .container {
  padding: 16px;
  h2{
font-size: 28px;
font-weight: 600;
line-height: 39.2px;
text-align: left;
  }

}

  .search-field{
    width:350px;
  }
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 236px);
}
.product-usecase {
  display: flex;
  justify-content: center;
  flex-direction:column;
  align-items: center;
  height: calc(100vh - 236px);
  text-align: center;
  h3{
font-size: 30px;
font-weight: 500;
  }
  p{
font-size: 20px;
font-weight: 400;
  }
}
.icon-search{
    color:#5D5FEF;
    margin-top:auto ;
  }
  ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within {
    border-color: #5D5FEF !important;
}
  ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: #F8F8FF !important;
        border-radius: 32px;
        width: 130%;
        border-color:#D2DCDC!important;
      }
      /* To remove the blue line ripple */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;
      }

      /* To ensure no outline or box-shadow appears on focus */
      ::ng-deep .mdc-text-field--filled .mdc-text-field__input {
        outline: none;
        box-shadow: none;
      }

      /* To remove any border that might be applied */
      ::ng-deep .mdc-text-field--filled {
        // border: none;
        border:1px solid black;
      }




lib-app-card {
  // flex: 1 1 calc(33.33% - 10px);
  margin-bottom: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

  lib-app-card {
  cursor: pointer;
}

.apps-grid {
  display: flex;
  flex-wrap: wrap;
  // flex: 1 1 calc(50% - 10px);
  gap: 20px;
  overflow-y: auto;
}
@media (max-width: 768px) {
  lib-app-card {
    flex: 1 1 calc(33.33% - 10px);
    }
    .search-field{
    max-width:70%;}

}
@media (max-width: 600px) {

  .search-field{
    max-width:70%;
  }
  lib-app-card {
    flex: 1 1 calc(33.33% - 10px);
    }
}
  `,
})
export class MyAiAppsComponent {
  isAsyncCall = true;
  apps = [];
  allApps = [];

  constructor(
    private appsService: AppsService,
    private _utilService: UtilityService,
    private router: Router
  ) {
    this.getAllApps();
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim();

    if (!this.allApps || this.allApps.length === 0) {
      return;
    }
    this.apps = this.allApps.filter((app: any) => {
      return app.title.trim().toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  getAllApps() {
    this.isAsyncCall = true;
    const userDetails = this._utilService.getCurrentUser();
    this.appsService
      .findByQuery(
        `filters[company_apps][company_users][user][id][$eq]=${userDetails.id}&sort=id:asc&populate=*`
      )
      .subscribe({
        next: (res: any) => {
          this.allApps = res.data?.map((data: any) => {
            return {
              id: data.id,
              title: data.attributes.app_Name,
              description: data.attributes.app_Description,
              icons: data.attributes.app_Icon,
              isRegioKiSystemApp: data.attributes.isRegioKiSystemApp,
              system_app: data.attributes.system_app,
            };
          });

          this.apps = this.allApps;
          this.isAsyncCall = false;
        },
        error: (err: any) => {
          console.error('Error creating app:', err);
          this.isAsyncCall = false;
        },
      });
  }

  navigateToProductUseCase(app: IApp): void {
    // if (
    //   app.isRegioKiSystemApp
    //   // &&
    //   // app.system_app === REGIOKI_SYSTEM_APPS_Enum.dataEntryApp
    // ) {
    //   const iconUrl = app.icons?.data?.attributes?.url
    //     ? `${environment.serverImageUrl}${app.icons.data.attributes.url}`
    //     : '';
    //   const name = app.title;
    //   console.log(name);

    //   // Pass both iconUrl and name in queryParams
    //   this.router.navigate(['/my-ai-apps/data-entry-app'], {
    //     queryParams: { iconUrl, name },
    //   });
    // } else {
    this.router.navigate(['/my-ai-apps', app.id]);
    // }
  }
}
