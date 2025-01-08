import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, UtilityService } from '@regio-ki/regioki-core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'uc-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  template: `
    <div class="container">
      <mat-toolbar>
        <!-- Hamburger Menu Icon -->
        <button
          mat-icon-button
          class="hamburger"
          (click)="toggleSidebar.emit()"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <div>
          <span class="selectedName">
            {{
              this.loggedInUser?.company_user
                ? 'Customer Dashboard'
                : selectedItem
            }}
          </span>
        </div>
        <span class="example-spacer"></span>
        <span
          class="icon-notification"
          [ngClass]="{ 'customer-notification': isCustomer }"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              rx="11"
              [attr.fill]="isCustomer ? '#0000FF' : '#008080'"
              fill-opacity="0.1"
            />
            <path
              d="M33.6712 30.5497C33.0284 29.9766 32.4656 29.3196 31.9979 28.5964C31.4874 27.5981 31.1814 26.5078 31.0979 25.3897V22.0964C31.1023 20.3401 30.4653 18.6427 29.3064 17.323C28.1476 16.0033 26.5467 15.1523 24.8046 14.9297V14.0697C24.8046 13.8336 24.7108 13.6073 24.5439 13.4404C24.377 13.2735 24.1506 13.1797 23.9146 13.1797C23.6785 13.1797 23.4522 13.2735 23.2853 13.4404C23.1184 13.6073 23.0246 13.8336 23.0246 14.0697V14.943C21.2981 15.1816 19.7166 16.0379 18.5729 17.3531C17.4293 18.6683 16.8011 20.3535 16.8046 22.0964V25.3897C16.7211 26.5078 16.4151 27.5981 15.9046 28.5964C15.4452 29.3179 14.8914 29.9748 14.2579 30.5497C14.1868 30.6122 14.1298 30.6891 14.0907 30.7753C14.0516 30.8615 14.0314 30.955 14.0312 31.0497V31.9564C14.0312 32.1332 14.1015 32.3027 14.2265 32.4278C14.3515 32.5528 14.5211 32.623 14.6979 32.623H33.2313C33.4081 32.623 33.5776 32.5528 33.7027 32.4278C33.8277 32.3027 33.8979 32.1332 33.8979 31.9564V31.0497C33.8978 30.955 33.8775 30.8615 33.8384 30.7753C33.7994 30.6891 33.7424 30.6122 33.6712 30.5497ZM15.4179 31.2897C16.0382 30.6905 16.5843 30.019 17.0446 29.2897C17.6877 28.084 18.0629 26.7537 18.1446 25.3897V22.0964C18.1181 21.315 18.2492 20.5364 18.5299 19.8068C18.8107 19.0772 19.2354 18.4115 19.7787 17.8495C20.3221 17.2874 20.973 16.8405 21.6927 16.5352C22.4124 16.2299 23.1862 16.0726 23.9679 16.0726C24.7497 16.0726 25.5234 16.2299 26.2431 16.5352C26.9628 16.8405 27.6137 17.2874 28.1571 17.8495C28.7004 18.4115 29.1251 19.0772 29.4059 19.8068C29.6866 20.5364 29.8177 21.315 29.7913 22.0964V25.3897C29.873 26.7537 30.2482 28.084 30.8913 29.2897C31.3515 30.019 31.8976 30.6905 32.5179 31.2897H15.4179Z"
              [attr.fill]="isCustomer ? '#0000FF' : '#008080'"
            />
            <path
              d="M23.9976 34.8559C24.4176 34.8463 24.8206 34.6884 25.1353 34.4102C25.4501 34.132 25.6564 33.7515 25.7176 33.3359H22.2109C22.2739 33.7628 22.4898 34.1523 22.8185 34.4319C23.1471 34.7115 23.5662 34.8622 23.9976 34.8559Z"
              [attr.fill]="isCustomer ? '#0000FF' : '#008080'"
            />
            <path
              d="M38.3333 12.6667C40.1743 12.6667 41.6667 11.1743 41.6667 9.33333C41.6667 7.49238 40.1743 6 38.3333 6C36.4924 6 35 7.49238 35 9.33333C35 11.1743 36.4924 12.6667 38.3333 12.6667Z"
              [attr.fill]="isCustomer ? '#0000FF' : '#008080'"
            />
          </svg>
        </span>

        <div class="dropdown">
          <button class="dropdown-toggle" [matMenuTriggerFor]="menu">
            <div class="username" *ngIf="loggedInUser?.company_user">
              <img
                *ngIf="logoUrl"
                [src]="logoUrl"
                alt="Customer Logo"
                class="customer-logo"
              />
            </div>
            <div
              *ngIf="!logoUrl && loggedInUser?.company_user"
              alt="Customer Logo"
              class="customer-logo icon-placeholder"
            >
              <mat-icon>account_circle</mat-icon>
            </div>

            <!-- <mat-icon *ngIf="!logoUrl" class="profile-picture">person</mat-icon> -->

            <div class="user-info">
              <span class="username">{{ username }}</span>
              <span class="role">{{ role }}</span>
            </div>
            <mat-icon class="icon-expand"> expand_more</mat-icon>
          </button>
          <mat-menu #menu="matMenu" yPosition="below" xPosition="before">
            <button mat-menu-item disabled>
              <span class="menu-content">
                <mat-icon>settings</mat-icon>
                <br />
                <span class="menu-text">Settings</span>
              </span>
            </button>

            <button
              class="menu-btn sign-out-btn"
              mat-menu-item
              (click)="signOut()"
              [ngClass]="{ 'customer-btn': isCustomer }"
            >
              <span class="menu-content">
                <mat-icon>logout</mat-icon>
                <span class="menu-text">Sign Out</span>
              </span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>
    </div>
  `,
  styles: [
    `
      mat-toolbar {
        background-color: #ffffff;
        position: fixed;
        left: 290px;
        right: 0;
        z-index: 1000;
        width: auto;
        height: auto;
      }
      .customer-logo {
        width: 38px;
        height: 38px;
        display: inline-block;
        vertical-align: middle;
        object-fit: contain;
        margin-top: 8px;
        border-radius: 12px;
      }
      .icon-placeholder mat-icon {
        font-size: 40px; /* Matches the size of the image */
        width: 100%;
        height: 100%;
        color: blue;
        margin-top: auto;
        margin-right: auto;
      }
      .menu-content {
        display: flex;
        align-items: center;
      }
      .menu-text {
        margin-top: 10px;
      }
      .sign-out-btn {
        background-color: #008080 !important; /* Change to green on hover */
      }

      .sign-out-btn .mat-icon,
      .sign-out-btn span {
        color: white; /*Change icon and text color to white on hover */
      }

      .menu-btn.sign-out-btn.customer-btn {
        background-color: #5d5fef !important; /* Blue color for customer users */
      }

      .customer-btn:hover .mat-icon,
      .customer-btn:hover span {
        color: white; /*Change icon and text color to white on hover */
      }

      .mat-menu-item {
        background-color: transparent !important; /* Ensure default background is transparent */
      }
      ::ng-deep .mat-mdc-menu-content {
        /* increased width of menu */
        width: 200px;
      }
      ::ng-deep .mat-icon {
        /* added margin-top on expand_more icon */
        margin-top: 14px;
      }

      .example-spacer {
        flex: 1 1 auto;
      }
      .selectedName {
        font-weight: bold;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin-top: 10px;
      }
      .dropdown {
        position: relative;
        display: inline-block;
      }
      .icon-notification svg {
        height: 40px;
        width: 40px;
        margin-right: 8px;
        margin-top: 20px;
      }

      .dropdown-toggle {
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 10px;
        font-size: 16px;
      }

      .profile-picture {
        align-content: center;
        height: 40px;
        width: 40px;
        margin-right: 8px;
        margin-top: 13px;
        border-radius: 20%;
        background-color: #f8f8f8;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        margin-top: 10px;
        width: min-content;
        padding: 0 5px 0 5px;
        align-items: start;
      }

      .username {
        font-size: 17px;
        font-weight: 500;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .icon-expand {
        margin-bottom: 8px;
      }

      .role {
        font-size: 12px;
        color: gray;
        margin-top: 2px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .caret {
        margin-left: auto;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .dropdown-menu.show {
        display: block;
      }
      .hamburger {
        display: none;
      }
      .dropdown-item {
        padding: 10px;
        text-decoration: none;
        display: block;
        color: black;
      }

      .dropdown-item:hover {
        background-color: #f1f1f1;
      }
      .icon-notification {
        fill: #008080 !important;
      }

      @media (max-width: 768px) {
        .container {
          width: 100%;

          height: 75px;
        }

        .selectedName {
          font-weight: bold;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin-top: 26px;
          font-size: 16px;
        }
        mat-toolbar {
          width: 100%;
          left: auto; /* Removed left positioning */
          right: auto; /* Removed right positioning */
          height: auto; /* Default height or standard oned */
          overflow-x: hidden;
        }

        .user-info,
        .icon-expand {
          display: none;
        }
        .mat-menu-item {
          display: none;
        }
        .icon-notification {
          margin-top: auto;
          margin-right: -5px;
        }
        .profile-picture {
          margin-top: 20px;
          margin-right: -5px;
        }
        .hamburger {
          // margin-top: auto;
          margin-top: 0px;
          display: block;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  @Input() selectedItem = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();
  isDropdownOpen = false;
  username: string | null = '';
  role: string | null = '';
  loggedInUser: any;
  logoUrl: string | null = '';
  isCustomer = false;
  color: { [klass: string]: any } | null | undefined;

  constructor(
    private router: Router,
    private _authService: AuthService,
    private _utilService: UtilityService
  ) {}
  ngOnInit(): void {
    const userDetails = this._utilService.getCurrentUser();
    this.username =
      userDetails?.username ||
      userDetails?.company_user?.company_id?.company_name ||
      '';
    this.role = userDetails?.role?.name || '';
    if (userDetails) {
      const user = userDetails;
      this.loggedInUser = user;
      this.username =
        userDetails?.username ||
        userDetails?.company_user?.company_id?.company_name ||
        '';
      if (this.loggedInUser?.company_user) {
        this.isCustomer = true; // Set to true if user has company_user
        const logo = user.company_user.company_id.logo;
        this.logoUrl = logo ? `${environment.serverImageUrl}${logo.url}` : ''; // Ensure the logo URL is set
      }
    }
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  signOut(): void {
    localStorage.clear();
    this._authService.isUserLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
}
