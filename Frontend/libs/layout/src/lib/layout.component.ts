import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UnderConstructionComponent } from '@regio-ki/under-construction';
import { RouterModule } from '@angular/router';
import { CustomerManagementComponent } from '@regio-ki/customer-management';
import { AppsManagementComponent } from '@regio-ki/apps-management';
import { DashboardComponent } from '@regio-ki/dashboard';
import { AuthService } from '@regio-ki/regioki-core';

@Component({
  selector: 'uc-layout',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UnderConstructionComponent,
    RouterModule,
    CustomerManagementComponent,
    AppsManagementComponent,
    DashboardComponent,
  ],
  template: `
    <ng-container *ngIf="isUserLoggedIn">
      <div class="container">
        <uc-sidebar
          class="sidebar"
          [class.hidden]="isSidebarHidden"
          (itemSelected)="updateHeader($event)"
          (toggleSidebar)="toggleSidebar()"
        ></uc-sidebar>
        <div class="main-content">
          <uc-header
            class="header"
            [selectedItem]="headerTitle"
            (toggleSidebar)="toggleSidebar()"
          ></uc-header>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="!isUserLoggedIn">
      <router-outlet></router-outlet>
    </ng-container>
  `,
  styles: [
    `
      .container {
        display: flex;
        background-color: #f8f8f8;
        min-height: 100vh;
      }

      .main-content {
        flex-grow: 1; /* Take up the remaining space */
        display: flex;
        position: relative;
        margin-left: 300px;
        flex-direction: column;
      }

      .header {
        height: 75px;
      }

      @media (max-width: 768px) {
        .container {
          width: 100%;

          overflow-x: hidden;
        }
        .main-content {
          margin-left: 0px;
        }

        .content {
          width: 100vw;
          overflow-x: hidden;
        }

        .sidebar.hidden {
          display: none;
        }

        .sidebar.open {
          transform: translatey(-100);
        }
        .sidebar {
          position: fixed; /* Fixed positioning to slide from the top */
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          z-index: 1000;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  headerTitle = 'Dashboard';
  @Output() itemSelected = new EventEmitter<string>();
  isUserLoggedIn = false;
  constructor(private _authService: AuthService) {}
  ngOnInit(): void {
    this._authService.isUserLoggedIn$.subscribe(
      (res) => (this.isUserLoggedIn = res)
    );

    const savedTitle = localStorage.getItem('selectedTitle');
    if (savedTitle) {
      this.headerTitle = savedTitle || '';
    }
  }

  updateHeader(selectedItem: string) {
    this.headerTitle = selectedItem;
    this.itemSelected.emit(selectedItem);
  }

  isSidebarHidden = true;

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
