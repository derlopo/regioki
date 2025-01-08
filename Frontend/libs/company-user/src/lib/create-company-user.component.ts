import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '@regio-ki/material';
import {
  AppsService,
  CompanyAppService,
  CompanyService,
  CompanyTypeService,
  ConfirmDialogConfig,
} from '@regio-ki/regioki-core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, forkJoin, map, of, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { ConfirmationDialogComponent } from '@regio-ki/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { CompanyUserService } from '@regio-ki/regioki-core';
import { MatTableDataSource } from '@angular/material/table';

interface App {
  id: number;
  app_Name: string;
}

interface AssignAIApp {
  apps_id: App[];
}
@Component({
  selector: 'lib-create-company-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
  ],
  template: `
    <div class="Company-custom-box">
      <div class="heading">
        <mat-icon class="arrow" (click)="goBack()"> arrow_back_ios </mat-icon>
        Create Employee
      </div>
      <div class="custom-form-container">
        <form [formGroup]="form" class="form">
          <!-- First Row -->
          <div class="form-row">
            <mat-form-field class="form-field">
              <mat-label>Enter First Name</mat-label>
              <input
                matInput
                formControlName="fname"
                placeholder="Enter First Name"
                required
                [readonly]="isView"
              />
              <mat-error *ngIf="form.get('fname')?.hasError('required')"
                >First name is required</mat-error
              >
            </mat-form-field>

            <mat-form-field  class="form-field">
              <mat-label>Enter Last Name</mat-label>
              <input
                matInput
                formControlName="lname"
                placeholder="Enter Last Name"
                required
                [readonly]="isView"
              />
              <mat-error *ngIf="form.get('lname')?.hasError('required')"
                >Last name is required</mat-error
              >
            </mat-form-field>

            <mat-form-field  class="form-field">
              <mat-label>Enter Email Account</mat-label>
              <input
                matInput
                formControlName="email"
                placeholder="Enter Email Account"
                required
                [readonly]="isView"
              />
              <mat-error
                *ngIf="
                  form.get('email')?.hasError('required') &&
                  form.get('email')?.touched
                "
                >Email is required</mat-error
              >
              <mat-error
                *ngIf="
                  form.get('email')?.hasError('email') &&
                  form.get('email')?.touched
                "
                >Please enter a valid email</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Second Row -->
          <div class="form-row">
            <mat-form-field  class="form-field">
              <mat-label>Assign Company App</mat-label>
              <mat-select formControlName="aiApp" [disabled]="isView" multiple>
                <ng-container *ngFor="let app of allAppsList">
                  <mat-option [value]="app.id">{{ app.app_Name }}</mat-option>
                </ng-container>
              </mat-select>
            </mat-form-field>

            <mat-form-field  class="form-field">
              <mat-label>Active/In-Active</mat-label>
              <mat-select formControlName="status" [disabled]="isView" required>
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
              <mat-error
                *ngIf="
                  form.get('status')?.hasError('required') &&
                  form.get('status')?.touched
                "
              >
                Status is required
              </mat-error>
            </mat-form-field>

            <mat-form-field
              
              class="form-field"
              autocomplete="off"
            >
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hide ? 'password' : 'text'"
                formControlName="password"
                required
                [readonly]="isView"
              />
              <mat-icon
                matSuffix
                (click)="!isView && (hide = !hide)"
                [ngClass]="{ 'disabled-icon': isUpdate }"
                >{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon
              >
              <mat-error *ngIf="form.get('password')?.hasError('minlength')"
                >Password must be at least 6 characters long.</mat-error
              >
              <mat-error
                *ngIf="
                  form.get('password')?.hasError('required') &&
                  form.get('password')?.touched &&
                  !isUpdate
                "
              >
                Password is required.
              </mat-error>
            </mat-form-field>
          </div>
        </form>
          <!-- Buttons -->
          <div class="button-container">
            <button
              *ngIf="isView"
              mat-raised-button
              class="cancel-btn"
              [routerLink]="['/customer-management']"
              routerLinkActive="router-link-active"
            >
              Cancel
            </button>
            <button
              *ngIf="!isView"
              mat-raised-button
              class="cancel-btn"
              [routerLink]="['/customer-management']"
              routerLinkActive="router-link-active"
            >
              Cancel
            </button>
            <button
              *ngIf="isUpdate"
              mat-raised-button
              class="save-btn"
              (click)="openConfirmationDialog('update')"
              [disabled]="form.invalid"
            >
              Update Account
            </button>
            <button
              *ngIf="!isView && !isUpdate"
              class="save-btn"
              mat-raised-button
              (click)="openConfirmationDialog('create')"
              [disabled]="form.invalid"
            >
              Save Account
            </button>
          </div>
      </div>
    </div>
  `,
  styles: `
  .Company-custom-box {
  border-radius: 22px;
  background-color: #FFFFFF;
  margin: 20px;
  display: flex;
  padding:20px;
  flex-direction: column;
  justify-content: space-between;
  min-height: 85vh; 
  position: relative;

  .heading {
    font-family: 'Poppins', sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    text-align: left;
    color: #2F3E3E;
    padding: 10px 20px;
    align-items: center;
  }

  .custom-form-container {
    flex: 1;
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    
    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-field {
      flex: 1;
      .mat-select{
        background:white !important;
      }
    }

    ///////////// Styling for inputs///////////////
    
      // On focus the border color of inputs
          ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within {
          border-color: #008080 !important;
      }

      // Border styling of input field
      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
          background-color: white !important; /* Background color */
          border-radius: 8px !important;
          border: 2px solid #D2D2D2 !important; /* Ensure green border */
      }

      /* Remove the blue line ripple */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
          display: none;
      }

      /* Hide the default blue ripple on hover */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple:hover {
        display: none;
      }

      /* To remove the blue line ripple */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;
      }

      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
      color: black !important;
      }
      ::ng-deep .mdc-text-field--filled .mdc-text-field--focused .mdc-floating-label,
      ::ng-deep .mdc-text-field--filled .mat-form-field-should-float .mdc-floating-label {
        display: none !important;
     }

      ::ng-deep  .mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
        background-color: #008080 !important;
        border-color: #B5E5E5 !important;
    }

    .button-container {
      display: flex;
      justify-content: flex-end; /* Align buttons to the right */
      gap: 16px;
      margin-right: 16px; 
      margin-bottom: 16px;

      .save-btn {
        background: #008080 !important;
        border-radius: 22px;
        color: white !important;
        font-family: 'Poppins', sans-serif;
        font-size: 15px;
        cursor: pointer;
        border: none !important;
        min-width: 160px;
      }
      .save-btn:disabled {
        background: #b3b3b3 !important; 
        cursor: not-allowed;
        color: #ffffff !important; 
      }
      .cancel-btn {
        background-color: #00808014 !important;
        border-radius: 22px;
        color: #008080 !important;
        font-family: 'Poppins', sans-serif;
        font-size: 15px;
        border: 1px solid #008080 !important;
        cursor: pointer;
        min-width: 160px;
      }
    }
  }
}

@media (max-width: 600px) {
  .Company-custom-box {
    .heading {
      font-size: 18px;
    }

    .custom-form-container {
      .form {
        .form-row {
          flex-direction: column;
          gap: 12px;
        }
      }
    }
  }
}

@media (max-width:480px){
  .button-container {
        flex-direction: column;
        align-items: stretch;
        button {
          width: 100% !important;
        }
      }
}

  `,
})
export class CreateCompanyUserComponent {
  dataSource = new MatTableDataSource<any>([]);
  form!: FormGroup;
  allAppsList: any[] = [];
  isView = false;
  hide = true;
  isUpdate = false;
  companyId: string | null = null;
  userId: any | null = null;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private companyUserService: CompanyUserService,
    private _snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private _appService: CompanyAppService
  ) {
    this.form = this.fb.group({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      aiApp: new FormControl(''),
      status: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.companyId =
      history.state.companyId || this.route.snapshot.paramMap.get('companyId');
    if (this.companyId) {
      this.getassignedCompanyApps(this.companyId);
      if (this.userId) {
        this.getCompanyUserDetails(this.userId, this.companyId);
      }
    } else {
      this.router.navigate(['/customer-management']);
    }
  }

  getassignedCompanyApps(companyId: string): void {
    // API call to get the apps associated with the specified company
    this._appService
      .findByQuery(`filters[company_id][id][$eq]=${companyId}&populate=*`)
      .pipe(
        map((appResponse: any) => {
          if (appResponse && appResponse.data) {
            this.allAppsList = appResponse.data.map((app: any) => {
              const attributes = app.attributes || {};
              return {
                id: app.id,
                app_Name:
                  attributes?.apps_id?.data[0]?.attributes?.app_Name ||
                  'Unnamed App',
              };
            });
            console.log('Apps found:', this.allAppsList);
          } else {
            console.error('No apps found');
            this.allAppsList = [];
          }
        }),
        catchError((error) => {
          console.error('Error fetching apps:', error);
          this.allAppsList = [];
          return of([]);
        })
      )
      .subscribe();
  }

  getCompanyUserDetails(userId: string, companyId: string): void {
    console.log('userID', userId);
    console.log('Company Id', companyId);
    this.isUpdate = true;
    const userQuery = this.companyUserService.findByQuery(
      `filters[id][$eq]=${userId}&populate[user]=*&populate[company_apps]=*`
    );
    const appQuery = this._appService
      .findByQuery(`filters[company_id][id][$eq]=${companyId}&populate=*
    `);

    forkJoin([userQuery, appQuery])
      .pipe(
        map(([userResponse, appResponse]: [any, any]) => {
          let aiAppIdsArray: number[] = [];
          if (userResponse && userResponse.data) {
            const user = userResponse.data[0]; // Assuming you get an array of results
            const companyUserAssignedapps = user.attributes.company_apps;
            aiAppIdsArray = companyUserAssignedapps.data.map(
              (company: { id: number }) => company.id
            );
            console.log(aiAppIdsArray);
            const userData = {
              fname: user.attributes.First_Name || '',
              lname: user.attributes.Last_Name || '',
              email: user.attributes.user.data.attributes.email || '',
              aiApp: aiAppIdsArray,
              status: user.attributes.employee_status || '',
            };

            this.form.patchValue(userData);
          } else {
            console.error('No user data found');
          }

          if (appResponse && appResponse.data) {
            this.allAppsList = appResponse.data.map((app: any) => {
              // Ensure attributes exist before accessing app_Name
              const attributes = app.attributes || {};
              return {
                id: app.id,
                app_Name:
                  attributes?.apps_id?.data[0]?.attributes?.app_Name ||
                  'Unnamed App', // Provide a fallback name if app_Name is missing
              };
            });
            console.log('Apps found:', this.allAppsList);
          } else {
            console.error('No apps found');
          }
        })
      )
      .subscribe(
        () => {
          // Optional: handle successful completion here
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  openConfirmationDialog(action: string): void {
    const dialogConfig: ConfirmDialogConfig = {
      confirmationMessage: `Are you sure you want to ${action} the company?`,
      logo: action === 'update' ? 'update' : 'check_circle',
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
        console.log('Action->', result);
        if (action === 'update' || action === 'create') {
          this.handleSave();
        }
      }
    });
  }

  createPayload(): FormData | null {
    if (this.form.valid) {
      const formData = new FormData();
      const formValues = this.form.value;
      this.companyId = history.state.companyId;
      if (this.companyId) {
        formData.append('company_id', this.companyId.toString());
      }
      formData.append('first_name', formValues.fname || '');
      formData.append('last_name', formValues.lname || '');
      formData.append('email', formValues.email || '');
      const selectedAppIds = Array.isArray(formValues.aiApp)
        ? formValues.aiApp
        : [];
      if (Array.isArray(selectedAppIds)) {
        selectedAppIds.forEach((appId) => {
          formData.append('app_ids', appId);
        });
      } else {
        formData.append('app_ids', selectedAppIds);
      }
      formData.append('status', formValues.status || '');
      formData.append('password', formValues.password || '');

      return formData;
    } else {
      console.error('Form is invalid');
      return null;
    }
  }

  updatePayLoad(): FormData | null {
    if (this.form) {
      const formData = new FormData();
      const formValues = this.form.value;
      this.companyId = history.state.companyId;
      if (this.companyId) {
        formData.append('company_id', this.companyId.toString());
      }
      formData.append('first_name', formValues.fname || '');
      formData.append('last_name', formValues.lname || '');
      formData.append('email', formValues.email || '');
      const selectedAppIds = Array.isArray(formValues.aiApp)
        ? formValues.aiApp
        : [];
      if (Array.isArray(selectedAppIds)) {
        selectedAppIds.forEach((appId) => {
          formData.append('app_ids', appId);
        });
      } else {
        formData.append('app_ids', selectedAppIds);
      }
      formData.append('status', formValues.status || '');
      formData.append('password', formValues.password || '');
      return formData;
    } else {
      console.log('Form is invalid');
      return null;
    }
  }

  onUpdate() {
    if (this.userId) {
      const payload = this.updatePayLoad();
      if (payload) {
        this.companyUserService
          .updateCompanyUser(this.userId, payload)
          .subscribe(
            (response) => {
              this._snackbar.open(`${response.message}`, undefined, {
                duration: 3000,
              });
              if (response.success) {
                this.form.reset();
                this.router.navigate([
                  `/customer-management/${this.companyId}`,
                ]);
              }
            },
            (error) => {
              console.error('Error updating company User data:', error);
            }
          );
      }
    } else {
      console.error('User id is not defined');
    }
  }

  onSubmit(): void {
    const payload = this.createPayload();
    if (payload) {
      this.companyUserService.createCompanyUser(payload).subscribe(
        (response: any) => {
          this._snackbar.open(`${response.message}`, undefined, {
            duration: 3000,
          });
          if (response.success) {
            this.form.reset();
            this.router.navigate([`/customer-management/${this.companyId}`]);
          }
        },
        (error) => {
          console.error('Error creating company:', error);
        }
      );
    }
  }

  handleSave() {
    if (this.userId === null || isNaN(this.userId)) {
      this.onSubmit();
    } else {
      this.onUpdate();
    }
  }

  onCancel(): void {
    this.form.reset();
  }

  goBack() {
    this.router.navigate([`/customer-management/${this.companyId}`]);
  }
}
