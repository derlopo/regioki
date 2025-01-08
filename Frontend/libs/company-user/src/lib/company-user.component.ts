import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyUserService, ConfirmDialogConfig, TableConfig } from '@regio-ki/regioki-core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchableTableComponent } from '@regio-ki/searchable-table';
import { ICompany_User } from 'libs/regioki-core/src/lib/models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '@regio-ki/material';
import { ConfirmationDialogComponent } from '@regio-ki/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'lib-company-user',
  standalone: true,
  imports: [CommonModule, SearchableTableComponent, MaterialModule],
  template: `
    <div class="company-user-container">
      <h3>Employee Management</h3>
      <div class="header-company-user">
        <button mat-raised-button (click)="addUserClicked()">
          + Create Employee
        </button>
        <div class="add-icon">
          <span
            routerLinkActive="router-link-active"
            (click)="addUserClicked()"
          >
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
      <div class="company-user-table">
      <lib-searchable-table
  [showFilter]="true"
  [showActions]="true"
  [columns]="columns"
  [dataSource]="dataSource"
  (update)="onUpdate($event)"
  (delete)="onDelete($event)"
  [totalCount]="totalCount"
  [pageSize]="pageSize"
  [pageIndex]="pageIndex"
  (pageChange)="onPageChange($event)"
  (searchChange)="onSearchChange($event)"
  (sortChange)="onSortChange($event)"
  [viewMembersIcon]="false"
></lib-searchable-table>

      </div>
    </div>
  `,
  styles: `
  .company-user-container{
    display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 22px;
        margin: 30px;
        background: #ffffff;
        border-radius: 22px;
        opacity: 0px;
        h3 {
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        line-height: 30px;
        text-align: left;
      }
    .header-company-user{
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
        // For small screens
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
      .company-user-table{
        margin-top: -6rem;
      }
  }

  @media (max-width: 768px) {
        .company-user-container {
          gap: 0px;
        }
        .company-user-table {
          margin-top: 0rem;
        }
        .header-company-user {
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
})
export class CompanyUserComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  // columns = ['id', 'firstName', 'lastName'];

  columns: TableConfig[] = [
    {
      columnDef: 'id',
      header: 'Employee ID',
      cell: (item: ICompany_User) => item.id || '-',
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (item: ICompany_User) => item.email || '-',
    },
    {
      columnDef: 'firstName',
      header: 'First Name',
      cell: (item: ICompany_User) => item.First_Name || '-',
    },
    {
      columnDef: 'lastName',
      header: 'Last Name',
      cell: (item: ICompany_User) => item.Last_Name || '-',
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (item: ICompany_User) => item.status || '-',
    },
  ];

  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  searchText = '';
  sortField = 'createdAt';
  sortDirection: 'desc' | 'asc' = 'desc';

  constructor(
    private _companyUserServic: CompanyUserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getCompanyUserDetails();
  }

  getCompanyUserDetails(): void {
    this.route.paramMap.subscribe((params: any) => {
      const companyId = params.get('id');
      let sortFieldQuery = this.sortField;
      if (this.sortField === 'email') {
        sortFieldQuery = 'user.email';
      } else if (this.sortField === 'firstName') {
        sortFieldQuery = 'First_Name';
      } else if (this.sortField === 'lastName') {
        sortFieldQuery = 'Last_Name';
      } else if (this.sortField === 'status') {
        sortFieldQuery = 'employee_status';
      }

      this._companyUserServic
        .findByQuery(
          `filters[company_id][id][$eq]=${companyId}` +
          `&populate[user]=*&populate[company_apps]=*` +
          `&pagination[page]=${this.pageIndex + 1}&pagination[pageSize]=${this.pageSize}` +
          `&sort=${sortFieldQuery}:${this.sortDirection}` +
          (this.searchText
            ? `&filters[$or][0][user][username][$containsi]=${this.searchText}` +
              `&filters[$or][1][user][email][$containsi]=${this.searchText}`
            : '')
        )
        .subscribe((res) => {
          this.totalCount = res.meta?.pagination?.total ?? 0;
          this.dataSource = new MatTableDataSource(
            res.data.map((data: any) => ({
              id: data?.id ?? '-',
              email: data?.attributes?.user?.data?.attributes?.email ?? '-',
              First_Name: data?.attributes?.First_Name ?? '-',
              Last_Name: data?.attributes?.Last_Name ?? '-',
              status: data?.attributes?.employee_status ?? '-',
            }))
          );
        });
    });
  }


  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction || 'desc';
    this.getCompanyUserDetails();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCompanyUserDetails();
  }

  onSearchChange(searchTerm: string): void {
    this.searchText = searchTerm;
    this.getCompanyUserDetails();
  }

  addUserClicked(): void {
    // this.router.navigate([`create-company-user`]);
    console.log("clicked");

    const companyId = this.route.snapshot.paramMap.get('id'); // Get the company ID from the URL
    this.router.navigateByUrl('/create-company-user', {
      state: { companyId: companyId },
    });
  }

  onUpdate(item: ICompany_User): void {
    const companyId = this.route.snapshot.paramMap.get('id'); // Get the company ID from the URL
    this.router.navigate([`/update-company-user/${item.id}`], {
      state: { userId: item.id, companyId: companyId }, // Pass userId via state if needed for other purposes
    });
  }

  onDelete(item: ICompany_User): void {
    this.openConfirmationDialog('delete', item);
  }


  openConfirmationDialog(action: string, item:ICompany_User): void {
    const dialogConfig: ConfirmDialogConfig = {
      confirmationMessage: `Are you sure you want to ${action} the company?`,
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
        console.log("Action->", result);
        this._companyUserServic.deleteCompanyUser(item.id).subscribe(
          (response: any) => {
            if (response.success) {
              this._snackbar.open('User and company-user deleted successfully.', undefined, {
                duration: 3000,
              });
              this.getCompanyUserDetails();
            } else {
              this._snackbar.open(`Error: ${response.message}`, undefined, {
                duration: 3000,
              });
            }
          },
          (error) => {
            console.error('Error deleting user:', error);
            this._snackbar.open('An error occurred while deleting the user.', undefined, {
              duration: 3000,
            });
          }
        );

      }
});
  }
}
