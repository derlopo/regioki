import {
  Component,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@regio-ki/material';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  Subject,
  Subscription,
} from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// eslint-disable-next-line @nx/enforce-module-boundaries

@Component({
  selector: 'lib-searchable-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="table-top">
      <mat-form-field
        *ngIf="showFilter"
        [ngClass]="{
          'customer-field': loggedInUser.company_user,
          'admin-field': !loggedInUser.company_user
        }"
      >
        <mat-icon matPrefix class="rounded-icon">search</mat-icon>
        <mat-label>Search here...</mat-label>
        <input
          matInput
          placeholder="Search"
          (keyup)="applyFilter($event)"
          class="input"
          #input
        />
      </mat-form-field>
    </div>
    <!-- Table Content -->
    <div class="regioki-table">
      <table
        mat-table
        [dataSource]="dataSource"
        matSort
        [ngClass]="{
          'customer-custom-table': loggedInUser.company_user,
          'admin-custom-table': !loggedInUser.company_user
        }"
      >
        <ng-container matColumnDef="logo" *ngIf="hasLogo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Company Logo
          </th>
          <td mat-cell *matCellDef="let row">
            <span class="logo-img" *ngIf="row.logo">
              <img [src]="row.logo" alt="" />
            </span>
            <span *ngIf="!row.logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <g clip-path="url(#clip0_602_721)">
                  <path
                    d="M2.76921 22.2976C2.34372 21.8534 2.05605 21.3143 1.76009 20.7857C1.17269 19.7339 0.714822 18.6264 0.430914 17.4534C0.239633 16.6636 0.0995618 15.8655 0.0460936 15.0508C0.0204891 14.6578 -0.00210307 14.2655 0.000156153 13.8725C0.00919303 12.6129 0.195202 11.3781 0.533332 10.1659C0.997225 8.50352 1.76461 6.9864 2.79406 5.60858C3.54186 4.6072 4.41919 3.7263 5.41174 2.95532C6.68443 1.96675 8.07912 1.21609 9.60259 0.709386C10.696 0.34573 11.8204 0.123622 12.9764 0.0453188C13.4643 0.0121907 13.9516 -0.0126553 14.4373 0.00692036C15.9495 0.068659 17.424 0.335189 18.8488 0.867497C20.114 1.34033 21.2895 1.97503 22.3694 2.77989C23.1519 3.36264 23.856 4.03273 24.5082 4.76532C25.4472 5.82014 26.1815 6.99845 26.7704 8.27313C27.299 9.41906 27.6402 10.6222 27.8322 11.869C27.9444 12.6009 28.0084 13.3357 28.0002 14.0766C27.9791 15.9016 27.644 17.6649 26.9323 19.3499C26.5076 20.3551 25.9985 21.3143 25.3456 22.1937C25.3109 22.2404 25.2778 22.2833 25.2213 22.3014C25.0707 22.3081 25.0172 22.1816 24.9442 22.0905C23.9501 20.846 22.7904 19.7836 21.4386 18.9366C19.6757 17.8321 17.7636 17.1402 15.6942 16.8947C15.1256 16.8269 14.5555 16.7773 13.981 16.7825C12.0192 16.8013 10.1373 17.1921 8.34119 17.9842C6.26196 18.9012 4.53215 20.27 3.09905 22.0258C3.01019 22.135 2.95371 22.2983 2.76996 22.2999L2.76921 22.2976Z"
                    fill="#C9E8E8"
                  />
                  <path
                    d="M2.76562 22.3002C3.32817 21.606 3.91707 20.9352 4.58354 20.3381C6.58521 18.5454 8.90467 17.3995 11.554 16.9334C14.5655 16.4034 17.4475 16.8235 20.1917 18.1599C22.1166 19.0973 23.7289 20.4292 25.0521 22.1127C25.104 22.1782 25.162 22.2392 25.217 22.3024C24.9993 22.7467 24.6499 23.0907 24.3223 23.4461C22.146 25.8057 19.4748 27.2935 16.3081 27.804C12.2054 28.4643 8.50253 27.4734 5.22893 24.909C4.3516 24.2216 3.58497 23.4228 2.90796 22.5374C2.85223 22.4643 2.77014 22.4056 2.76562 22.3009V22.3002Z"
                    fill="#008080"
                  />
                  <path
                    d="M13.9892 14.9072C11.0424 14.9449 8.55199 12.4437 8.56253 9.47948C8.57308 6.55517 10.9739 4.02012 14.0283 4.06304C17.0354 4.1052 19.4173 6.46407 19.4121 9.50282C19.4068 12.5205 16.9879 14.8869 13.9899 14.908L13.9892 14.9072Z"
                    fill="#008080"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_602_721">
                    <rect width="28" height="28" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </td>
        </ng-container>
        <ng-container
          *ngFor="let column of columns"
          [matColumnDef]="column.columnDef"
        >
          <th mat-header-cell *matHeaderCellDef>
            <div>
              <ng-container
                *ngIf="!isSortDisabled(column.columnDef); else noSort"
              >
                <div mat-sort-header="{{ column.columnDef }}">
                  {{ column.header }}
                </div>
              </ng-container>
              <ng-template #noSort>
                <div>{{ column.header }}</div>
              </ng-template>
            </div>
          </th>
          <td mat-cell *matCellDef="let row">
            <div>{{ column.cell(row) }}</div>
          </td>
        </ng-container>

        <ng-container matColumnDef="action" *ngIf="showActions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
          <td mat-cell *matCellDef="let item">
            <div class="actions">
              <span (click)="onUpdate(item, $event)">
                <svg
                  class="svg-links"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 5.25V0.345C9.68475 0.6045 10.3147 1.00425 10.8488 1.5375L13.4618 4.152C13.9958 4.68525 14.3955 5.31525 14.655 6H9.75C9.336 6 9 5.66325 9 5.25ZM9.9525 14.61C9.34275 15.2197 9 16.0463 9 16.9088V18H10.0912C10.9537 18 11.7803 17.6573 12.39 17.0475L17.4953 11.9423C18.168 11.2695 18.168 10.1775 17.4953 9.50475C16.8225 8.832 15.7305 8.832 15.0577 9.50475L9.9525 14.61ZM7.5 16.9088C7.5 15.6398 7.99425 14.4465 8.89125 13.5495L13.9965 8.44425C14.2882 8.1525 14.628 7.92825 14.9948 7.7685C14.9917 7.6785 14.988 7.58925 14.982 7.49925H9.75C8.5095 7.49925 7.5 6.48975 7.5 5.24925V0.018C7.37925 0.00975 7.2585 0 7.13625 0H3.75C1.68225 0 0 1.68225 0 3.75V14.25C0 16.3177 1.68225 18 3.75 18H7.5V16.9088Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span (click)="onDelete(item, $event)">
                <svg
                  class="svg-links"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="18"
                  viewBox="0 0 15 18"
                  fill="none"
                >
                  <path
                    d="M14.25 3.03905H11.925C11.5662 1.29425 10.0313 0.0413125 8.24998 0.0390625H6.74996C4.96863 0.0413125 3.43378 1.29425 3.07498 3.03905H0.749988C0.335777 3.03905 0 3.37483 0 3.78904C0 4.20325 0.335777 4.53906 0.749988 4.53906H1.49998V14.2891C1.50247 16.3591 3.17995 18.0366 5.24999 18.0391H9.74999C11.82 18.0366 13.4975 16.3591 13.5 14.2891V4.53906H14.25C14.6642 4.53906 15 4.20329 15 3.78907C15 3.37486 14.6642 3.03905 14.25 3.03905ZM6.75 12.7891C6.75 13.2033 6.41422 13.5391 6.00001 13.5391C5.58577 13.5391 5.24999 13.2033 5.24999 12.7891V8.28907C5.24999 7.87486 5.58576 7.53909 5.99998 7.53909C6.41419 7.53909 6.74996 7.87486 6.74996 8.28907V12.7891H6.75ZM9.74999 12.7891C9.74999 13.2033 9.41421 13.5391 9 13.5391C8.58579 13.5391 8.25001 13.2033 8.25001 12.7891V8.28907C8.25001 7.87486 8.58579 7.53909 9 7.53909C9.41421 7.53909 9.74999 7.87486 9.74999 8.28907V12.7891ZM4.62825 3.03905C4.94726 2.14077 5.79677 1.5402 6.75 1.53904H8.25001C9.20324 1.5402 10.0528 2.14077 10.3718 3.03905H4.62825Z"
                  />
                </svg>
              </span>

              <mat-icon
                class="pointer"
                *ngIf="viewMembersIcon"
                (click)="viewMembersClicked(item, $event)"
                >people</mat-icon
              >
            </div>
          </td>
        </ng-container>

        <ng-container *ngIf="keyword$">
          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">No data matching the keyword</td>
          </tr>
        </ng-container>
        <!-- Row to display the header of table -->
        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns; sticky: true"
        ></tr>
        <!-- Row to display the data of table -->
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          (click)="onRowClick(row)"
        ></tr>
        <!-- No data row -->
        <tr class="mat-row no-data" *matNoDataRow>
          <td class="mat-cell custom-colspan" colspan="5">
            No data available.
          </td>
        </tr>
      </table>

      <mat-paginator
        #paginator
        class="hidden-paginator"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page"
        (page)="onPageChange($event)"
      ></mat-paginator>

      <mat-paginator
        #paginator
        [ngClass]="{ 'hidden-paginator': !isSearchFilled }"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page"
        (page)="onPageChange($event)"
      ></mat-paginator>

      <mat-paginator
        #paginator
        [ngClass]="{ 'hidden-paginator': isSearchFilled }"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page"
        (page)="onPageChange($event)"
      ></mat-paginator>
    </div>

    <!-- Responsive cards for table data -->
    <div
      matSort
      [ngClass]="{
        'customer-responsive-table': loggedInUser.company_user,
        'admin-responsive-table': !loggedInUser.company_user
      }"
    >
      <ng-container *ngIf="dataSource.data.length; else noData">
        <mat-card
          *ngFor="let row of dataSource.filteredData"
          class="custom-card"
          (click)="onRowClick(row)"
        >
          <mat-card-content>
            <div class="card-row" *ngIf="hasLogo">
              <div class="card-column"><strong>Company Logo:</strong></div>
              <div class="card-column">
                <span class="logo-img" *ngIf="row.logo">
                  <img [src]="row.logo" alt="" />
                </span>
                <span *ngIf="!row.logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_602_721)">
                      <path
                        d="M2.76921 22.2976C2.34372 21.8534 2.05605 21.3143 1.76009 20.7857C1.17269 19.7339 0.714822 18.6264 0.430914 17.4534C0.239633 16.6636 0.0995618 15.8655 0.0460936 15.0508C0.0204891 14.6578 -0.00210307 14.2655 0.000156153 13.8725C0.00919303 12.6129 0.195202 11.3781 0.533332 10.1659C0.997225 8.50352 1.76461 6.9864 2.79406 5.60858C3.54186 4.6072 4.41919 3.7263 5.41174 2.95532C6.68443 1.96675 8.07912 1.21609 9.60259 0.709386C10.696 0.34573 11.8204 0.123622 12.9764 0.0453188C13.4643 0.0121907 13.9516 -0.0126553 14.4373 0.00692036C15.9495 0.068659 17.424 0.335189 18.8488 0.867497C20.114 1.34033 21.2895 1.97503 22.3694 2.77989C23.1519 3.36264 23.856 4.03273 24.5082 4.76532C25.4472 5.82014 26.1815 6.99845 26.7704 8.27313C27.299 9.41906 27.6402 10.6222 27.8322 11.869C27.9444 12.6009 28.0084 13.3357 28.0002 14.0766C27.9791 15.9016 27.644 17.6649 26.9323 19.3499C26.5076 20.3551 25.9985 21.3143 25.3456 22.1937C25.3109 22.2404 25.2778 22.2833 25.2213 22.3014C25.0707 22.3081 25.0172 22.1816 24.9442 22.0905C23.9501 20.846 22.7904 19.7836 21.4386 18.9366C19.6757 17.8321 17.7636 17.1402 15.6942 16.8947C15.1256 16.8269 14.5555 16.7773 13.981 16.7825C12.0192 16.8013 10.1373 17.1921 8.34119 17.9842C6.26196 18.9012 4.53215 20.27 3.09905 22.0258C3.01019 22.135 2.95371 22.2983 2.76996 22.2999L2.76921 22.2976Z"
                        fill="#C9E8E8"
                      />
                      <path
                        d="M2.76562 22.3002C3.32817 21.606 3.91707 20.9352 4.58354 20.3381C6.58521 18.5454 8.90467 17.3995 11.554 16.9334C14.5655 16.4034 17.4475 16.8235 20.1917 18.1599C22.1166 19.0973 23.7289 20.4292 25.0521 22.1127C25.104 22.1782 25.162 22.2392 25.217 22.3024C24.9993 22.7467 24.6499 23.0907 24.3223 23.4461C22.146 25.8057 19.4748 27.2935 16.3081 27.804C12.2054 28.4643 8.50253 27.4734 5.22893 24.909C4.3516 24.2216 3.58497 23.4228 2.90796 22.5374C2.85223 22.4643 2.77014 22.4056 2.76562 22.3009V22.3002Z"
                        fill="#008080"
                      />
                      <path
                        d="M13.9892 14.9072C11.0424 14.9449 8.55199 12.4437 8.56253 9.47948C8.57308 6.55517 10.9739 4.02012 14.0283 4.06304C17.0354 4.1052 19.4173 6.46407 19.4121 9.50282C19.4068 12.5205 16.9879 14.8869 13.9899 14.908L13.9892 14.9072Z"
                        fill="#008080"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_602_721">
                        <rect width="28" height="28" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div class="card-row" *ngFor="let column of columns">
              <div class="card-column">
                <strong>{{ column.header }}:</strong>
              </div>
              <div class="card-column">{{ column.cell(row) }}</div>
            </div>
            <div class="card-row">
              <div class="card-column"><strong>Actions:</strong></div>
              <div class="card-column">
                <div class="actions">
                  <span (click)="onUpdate(row, $event)">
                    <svg
                      class="svg-links"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M9 5.25V0.345C9.68475 0.6045 10.3147 1.00425 10.8488 1.5375L13.4618 4.152C13.9958 4.68525 14.3955 5.31525 14.655 6H9.75C9.336 6 9 5.66325 9 5.25ZM9.9525 14.61C9.34275 15.2197 9 16.0463 9 16.9088V18H10.0912C10.9537 18 11.7803 17.6573 12.39 17.0475L17.4953 11.9423C18.168 11.2695 18.168 10.1775 17.4953 9.50475C16.8225 8.832 15.7305 8.832 15.0577 9.50475L9.9525 14.61ZM7.5 16.9088C7.5 15.6398 7.99425 14.4465 8.89125 13.5495L13.9965 8.44425C14.2882 8.1525 14.628 7.92825 14.9948 7.7685C14.9917 7.6785 14.988 7.58925 14.982 7.49925H9.75C8.5095 7.49925 7.5 6.48975 7.5 5.24925V0.018C7.37925 0.00975 7.2585 0 7.13625 0H3.75C1.68225 0 0 1.68225 0 3.75V14.25C0 16.3177 1.68225 18 3.75 18H7.5V16.9088Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span (click)="onDelete(row, $event)">
                    <svg
                      class="svg-links"
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="18"
                      viewBox="0 0 15 18"
                      fill="none"
                    >
                      <path
                        d="M14.25 3.03905H11.925C11.5662 1.29425 10.0313 0.0413125 8.24998 0.0390625H6.74996C4.96863 0.0413125 3.43378 1.29425 3.07498 3.03905H0.749988C0.335777 3.03905 0 3.37483 0 3.78904C0 4.20325 0.335777 4.53906 0.749988 4.53906H1.49998V14.2891C1.50247 16.3591 3.17995 18.0366 5.24999 18.0391H9.74999C11.82 18.0366 13.4975 16.3591 13.5 14.2891V4.53906H14.25C14.6642 4.53906 15 4.20329 15 3.78907C15 3.37486 14.6642 3.03905 14.25 3.03905ZM6.75 12.7891C6.75 13.2033 6.41422 13.5391 6.00001 13.5391C5.58577 13.5391 5.24999 13.2033 5.24999 12.7891V8.28907C5.24999 7.87486 5.58576 7.53909 5.99998 7.53909C6.41419 7.53909 6.74996 7.87486 6.74996 8.28907V12.7891H6.75ZM9.74999 12.7891C9.74999 13.2033 9.41421 13.5391 9 13.5391C8.58579 13.5391 8.25001 13.2033 8.25001 12.7891V8.28907C8.25001 7.87486 8.58579 7.53909 9 7.53909C9.41421 7.53909 9.74999 7.87486 9.74999 8.28907V12.7891ZM4.62825 3.03905C4.94726 2.14077 5.79677 1.5402 6.75 1.53904H8.25001C9.20324 1.5402 10.0528 2.14077 10.3718 3.03905H4.62825Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <mat-icon
                    class="pointer"
                    *ngIf="viewMembersIcon"
                    (click)="viewMembersClicked(row, $event)"
                    >people</mat-icon
                  >
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-container>
      <ng-template #noData>
        <div class="no-data">
          <div>No data available.</div>
        </div>
      </ng-template>
      <mat-paginator
        #paginator
        [ngClass]="{ 'hidden-paginator': !isSearchFilled }"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page"
        (page)="onPageChange($event)"
      ></mat-paginator>
      <mat-paginator
        #paginator
        [ngClass]="{ 'hidden-paginator': isSearchFilled }"
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page"
        (page)="onPageChange($event)"
      ></mat-paginator>
    </div>
  `,
  styles: `
  .table-top {
    .customer-field{
      margin-top:20px;
      /* To customize the style of searchbar */
      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: #F8F8FF !important;
        border-radius: 24px;
        width: 100%;
      }
      /* To remove any border that might be applied */
      ::ng-deep .mdc-text-field--filled {
        border: none;
      }
       /* To ensure no outline or box-shadow appears on focus */
       ::ng-deep .mdc-text-field--filled .mdc-text-field__input {
        outline: none;
        box-shadow: none;
      }
      /* To remove any border that might be applied */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;
      }
      /* To change the text color inside search bar */
      ::ng-deep mat-label[_ngcontent-ng-c1336510187] {
         color: #5F627B !important;
      }
      .rounded-icon {
        color: #5D5FEF;
        margin-top:auto;
      }
      mat-label{
        color: #5F627B !important;
      }
    }
    .admin-field{
      margin-top:20px;
      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: #eef9f9 !important;
        border-radius: 32px;
        width: 100%;
      }
      ::ng-deep .mdc-text-field--filled {
        border: none;
      }
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;
      }
      ::ng-deep mat-label[_ngcontent-ng-c1336510187] {
         color: #5F627B !important;
      }
      .rounded-icon {
        color:  #649999;
        margin-top:auto;
      }
      .rounded-icon {
        color: #649999;
        margin-top:auto;
      }
      mat-label{
        color: #008080 !important;
      }
    }
  }
  .hidden-paginator {
display: none;
}
  ///////////////////////////
      .logo-img {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: #c9e8e8;
        border-radius: 50%;
        padding: 4px;
        overflow: hidden;
        text-align: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
      }
      .actions {
        display: flex;
        align-items:center;
        gap: 15px;
        opacity: 1;
        span {
          cursor: pointer;
        }
      }
      .no-data{
        width:100%;
        display:block;
        background:transparent;
        padding:20px;
        font-size:18px;
        font-weight:500;
      }

  ///////////////////
      .customer-custom-table{
        background-color: transparent;
        overflow: hidden;
        border-radius: 8px;
        opacity: 1;
        border: 1px solid #d2dcdc;
        width: 100%;
        th {
        background: #EEEEF9;
      }
      tr:nth-child(odd) {
        background-color: transparent;
      }
      tr:nth-child(even) {
        background: #FAFAFF;
      }
      th,
      tr,
      td {
        border: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      th {
        font-size: 16px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: 0.02em;
        text-align: left;
      }
      .svg-links path{
       fill: #63649E !important;
    }
    .pointer{
          color:#63649E;
          margin-top:0px;
        }

   }
   .admin-custom-table{
        background-color: transparent;
        overflow: hidden;
        border-radius: 8px;
        opacity: 1;
        border: 1px solid #d2dcdc;
        cursor:pointer;
        width: 100%;

        th {
        background: #eef9f9;
      }
      tr:nth-child(odd) {
        background-color: transparent;
      }
      tr:nth-child(even) {
        background: #f6fcfc;
      }
      th,
      tr,
      td {
        border: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      th {
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: 0.02em;
        text-align: left;
      }
      .svg-links path {
        fill: #649999 !important;
       }
       .pointer{
          color:#649999;
          margin-top:0px;
        }
   }
      mat-paginator {
        background: transparent;
      }
      .customer-responsive-table {
        display: none; /* Hide responsive table (cards) on larger screens */
      }

      .admin-responsive-table {
        display: none; /* Hide responsive table (cards) on larger screens */
      }

      .regioki-table {
        display: block; /* Show the original table on larger screens */
      }

      @media (max-width: 768px) {
        .actions {
          gap: 10px;
        }

        .table-top {
          .add-icon {
            visibility: visible;
            opacity: 1;
          }
          button {
            display: none;
          }
        }

        .regioki-table {
          display: none; /* Hide the original table on smaller screens */
        }
        .customer-responsive-table{
          display: flex; /* Show the responsive table (cards) on smaller screens */
          flex-wrap: wrap;
          gap: 1rem;
          .card-column:nth-child(odd) {
            background: #EEEEF9;
        }
        .custom-card {
          flex: 1 1 calc(50% - 1rem); /* Two columns by default */
          margin-bottom: 1rem;
          background: transparent;
          overflow: hidden;
          padding: 0px;
          box-shadow: none;
          opacity: 1;
          border: 1px solid #d2dcdc;
          mat-card-content {
            padding: 0; /* Removes the padding inside the card */
          }
        }
        .card-row {
          display: flex;
          justify-content: space-between;
        }

        .card-column {
          flex: 1;
          border-bottom: 1px solid #d2dcdc;
          padding-left: 12px;
          padding-top: 5px;
          font-size:12px;
          width:20px;
        }
        ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          width: 100%;
        }
        .svg-links path{
       fill: #63649E !important;
        }
        .pointer{
          color:#63649E;
          margin-top:0px;
        }
      }

        .admin-responsive-table{
          display: flex; /* Show the responsive table (cards) on smaller screens */
          flex-wrap: wrap;
          gap: 1rem;
          .card-column:nth-child(odd) {
            background-color: #eef9f9;
        }
        .custom-card {
          flex: 1 1 calc(50% - 1rem); /* Two columns by default */
          margin-bottom: 1rem;
          background: transparent;
          overflow: hidden;
          padding: 0px;
          box-shadow: none;
          opacity: 1;
          border: 1px solid #d2dcdc;
          mat-card-content {
            padding: 0; /* Removes the padding inside the card */
          }
        }
        .card-row {
          display: flex;
          justify-content: space-between;
        }

        .card-column {
          flex: 1;
          border-bottom: 1px solid #d2dcdc;
          padding-left: 10px;
          padding-top: 5px;
        }
        ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          width: 100%;
        }
        .svg-links path {
        fill: #649999 !important;
       }
       .pointer{
          color:#649999;
          margin-top:0px;
        }

        }
      }

      @media (max-width: 600px) {
        .table-top {
          flex-direction: column;
          padding-bottom: 20px;
          .customer-field{
            width:100%;
          }
          .admin-field{
            width:100%;
          }
        }
        .admin-responsive-table{
          .custom-card {
            flex: 1 1 100%; /* Single column on very small screens */
          }
        }
        .customer-responsive-table{
          .custom-card {
            flex: 1 1 100%; /* Single column on very small screens */
          }
        }
        ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          width: 100%;
        }
      }

  `,
})
export class SearchableTableComponent implements OnInit {
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() totalCountChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>(); // Emit search term
  @Output() sortChange = new EventEmitter<{
    active: string;
    direction: SortDirection;
  }>();

  @Input() dataSource = new MatTableDataSource<any>();

  @Input() keyword$!: BehaviorSubject<string>;
  @Input() columns!: any[];
  @Input() showActions = false;
  @Input() hasLogo = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 1;
  @Input() showFilter = false;
  @Input() disableSortColumns: string[] = [];
  @Input() viewMembersIcon = false;

  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() viewMembers = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  displayedColumns: any;
  loggedInUser: any;
  filterTimeout: any;
  isSearchFilled = false;

  constructor() {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sortState) => {
      this.sortChange.emit({
        active: sortState.active,
        direction: sortState.direction,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.loggedInUser = user;
    }

    if (this.columns) {
      this.displayedColumns = [];
      if (this.hasLogo) {
        this.displayedColumns.push('logo');
      }
      this.displayedColumns.push(
        ...this.columns.map((column) => column.columnDef)
      );
      if (this.showActions) {
        this.displayedColumns.push('action');
      }
    }
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((filterValue) => {
        if (filterValue.trim().length > 0) {
          this.isSearchFilled = true;
          this.searchChange.emit(filterValue);
        } else {
          this.isSearchFilled = false;
          this.searchChange.emit(''); // Emit empty string to indicate no search
        }
      });
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();
    if (filterValue.length > 0) {
      this.searchSubject.next(filterValue);
    } else {
      this.searchSubject.next(''); // Emit empty string to indicate no search
    }
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  onRowClick(row: any) {
    this.view.emit(row);
  }

  onView(item: any) {
    this.view.emit(item);
  }

  onUpdate(item: any, event: MouseEvent) {
    event.stopPropagation();
    this.update.emit(item);
  }

  onDelete(item: any, event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(item);
  }
  isSortDisabled(column: string): boolean {
    return this.disableSortColumns.includes(column);
  }

  viewMembersClicked(item: any, event: MouseEvent): void {
    event.stopPropagation();
    this.viewMembers.emit(item);
  }
}
