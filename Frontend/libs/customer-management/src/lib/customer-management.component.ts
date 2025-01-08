import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableTableComponent } from '@regio-ki/searchable-table';
import { Router } from '@angular/router';
import { forkJoin, map, Subject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ICompany } from 'libs/regioki-core/src/lib/models/interfaces';
import { TableConfig } from '@regio-ki/regioki-core';
import { CompanyService, ConfirmDialogConfig } from '@regio-ki/regioki-core';
import { ConfirmationDialogComponent } from '@regio-ki/confirmation-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'lib-customer-management',
  standalone: true,
  imports: [CommonModule, SearchableTableComponent],
  template: ` <div class="management-container">
    <h3>Customer Management</h3>
    <div class="addcompany-btn">
      <button
        mat-flat-button
        routerLinkActive="router-link-active"
        (click)="addCompany()"
      >
        + Add Company
      </button>
      <div class="add-icon">
        <span routerLinkActive="router-link-active" (click)="addCompany()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M24 12C24 13.3275 22.9275 14.4 21.6 14.4L14.4 14.4L14.4 21.6C14.4 22.9275 13.3275 24 12 24C10.6725 24 9.6 22.9275 9.6 21.6L9.6 14.4L2.4 14.4C1.0725 14.4 -1.95538e-10 13.3275 -1.76061e-10 12C-1.56584e-10 10.6725 1.0725 9.6 2.4 9.6L9.6 9.6L9.6 2.4C9.6 1.0725 10.6725 1.56584e-10 12 1.76061e-10C13.3275 1.95538e-10 14.4 1.0725 14.4 2.4L14.4 9.6L21.6 9.6C22.9275 9.6 24 10.6725 24 12Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
    </div>
    <div class="customer-management-table">
      <lib-searchable-table
        [showFilter]="true"
        [showActions]="true"
        [hasLogo]="true"
        [columns]="columns"
        [disableSortColumns]="['actions']"
        [dataSource]="dataSource"
        (update)="onUpdate($event)"
        (delete)="onDelete($event)"
        (view)="onView($event)"
        [totalCount]="totalCount"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        (pageChange)="onPageChange($event)"
        (searchChange)="onSearchChange($event)"
        (sortChange)="onSortChange($event)"
        [viewMembersIcon]="false"
        (viewMembers)="onViewMembersClick($event)"
      ></lib-searchable-table>
    </div>
  </div>`,
  styles: [
    `
      .addcompany-btn {
        display: inline-block;
        text-align: right;
        width: 30%;
        margin-left: auto;
        z-index: 1;
        button {
          padding: 10px 44px;
          height: 44px;
          color: #fff;
          border-radius: 22px;
          border: none;
          background: #008080;
          cursor: pointer;
        }
        .add-icon {
          visibility: hidden;
          position: fixed;
          width: 60px;
          height: 60px;
          border-radius: 50px;
          cursor: pointer;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #008080;
          color: white;
        }
      }
      .customer-management-table {
        margin-top: -6rem;
      }

      .management-container {
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 22px;
        margin: 30px;
        background: #ffffff;
        border-radius: 22px;
        opacity: 0px;
      }

      h3 {
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
        text-align: left;
      }
      @media (max-width: 768px) {
        .management-container {
          gap: 0px;
        }
        .customer-management-table {
          margin-top: 0rem;
        }
        .addcompany-btn {
          .add-icon {
            visibility: visible;
            opacity: 1;
          }
          button {
            display: none;
          }
        }
      }
    `,
  ],
})
export class CustomerManagementComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  companyCount = 0;
  pageSize = 10;
  pageIndex = 0;
  totalCount = 0;
  filterDesgination = '';
  searchText = '';
  dataSource = new MatTableDataSource();
  sortField = 'createdAt';
  sortDirection: 'desc' | 'asc' = 'desc';

  columns: TableConfig[] = [
    {
      columnDef: 'id',
      header: 'Company ID',
      cell: (item: ICompany) => item.id || '-',
    },
    {
      columnDef: 'company_name',
      header: 'Companies',
      cell: (item: ICompany) => item.company_name || '-',
    },
    {
      columnDef: 'company_type',
      header: 'Type',
      cell: (item: ICompany) => item.company_type || '-',
    },
    {
      columnDef: 'company_status',
      header: 'Status',
      cell: (item: ICompany) => item.company_status || '-',
    },
  ];

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCompanies(page = 1, pageSize = this.pageSize, search = ''): void {
    this.companyService
      .getCompaniesDetailsPaginated(
        page,
        pageSize,
        search,
        this.sortField,
        this.sortDirection
      )
      .subscribe(
        (response) => {
          this.totalCount = response.meta.pagination.total;
          this.dataSource.data = this.transformToTableData(response.data);
        },
        (error) => {
          console.error('Error fetching companies', error);
        }
      );
  }

  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction || 'desc'; // Default to 'desc' if no direction
    this.loadCompanies(this.pageIndex + 1, this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCompanies(this.pageIndex + 1);
  }
  onSearchChange(searchTerm: string): void {
    if (searchTerm.trim().length > 0) {
      this.loadCompanies(1, this.pageSize, searchTerm); // Reset to page 1 for search
    } else {
      this.loadCompanies(this.pageIndex + 1, this.pageSize); // Use current page index for regular load
    }
  }

  addCompany(): void {
    this.router.navigate([`/create-customer`]);
  }

  onUpdate(item: ICompany): void {
    this.router.navigate([`/update-customer/${item.id}`]);
  }

  onView(item: ICompany): void {
    this.router.navigate([`/view-customer/${item.id}`]);
  }

  onDelete(item: ICompany): void {
    const { company_name, id } = item;
    this.openConfirmationDialog('delete', company_name, id);
  }

  onViewMembersClick(item: ICompany): void {
    this.router.navigate([`/customer-management/${item.id}`]);
  }

  deleteCompany(id?: string): void {
    this.companyService.deleteCompany(id).subscribe(
      () => {
        this.loadCompanies(); // Reload the current page
        this.snackBar.open('Item deleted successfully', 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Failed to delete item', 'Close', {
          duration: 3000,
        });
        console.error('Error deleting item', error);
      }
    );
  }

  openConfirmationDialog(action: string, title: string, id?: string): void {
    const dialogConfig: ConfirmDialogConfig = {
      confirmationMessage: `Are you sure you want to ${action} the company ${title}?`,
      logo: action === 'delete' ? 'delete' : 'check_circle',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        ...dialogConfig,
        action,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (action === 'delete' && id) {
          this.deleteCompany(id);
        } else {
          console.log(`${action} confirmed`);
        }
      } else {
        console.log(`${action} canceled`);
      }
    });
  }

  transformToTableData(data: any[]): any[] {
    return data.map((item: any) => {
      const tableItem: any = {
        id: item.id,
        company_name: item.attributes.company_name || '',
        address: item.attributes.address || '',
        contact_person: item.attributes.contact_person || '',
        tax_id: item.attributes.tax_id || '',
        user_count: item.attributes.user_count || 0,
        company_type:
          item.attributes.Company_TypeID?.data?.attributes?.company_type || '',
        company_status: item.attributes.company_status || 'inactive',
        createdAt: item.attributes.createdAt || '',
        updatedAt: item.attributes.updatedAt || '',
        logo: item.attributes?.logo?.data?.attributes?.url
          ? `${environment.serverImageUrl}${item.attributes.logo.data.attributes.url}`
          : '',
        publishedAt: item.attributes.publishedAt || '',
      };
      return tableItem;
    });
  }
}
