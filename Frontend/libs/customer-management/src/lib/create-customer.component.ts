import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { forkJoin, map, Subscription } from 'rxjs';
import { environment } from '@env/environment';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfirmationDialogComponent } from '@regio-ki/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
interface App {
  id: number;
  app_Name: string;
}

interface AssignAIApp {
  apps_id: App[];
}
@Component({
  selector: 'lib-create-customer',
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
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="custom-box">
      <div class="heading">
        <mat-icon class="arrow" (click)="goBack()"> arrow_back_ios </mat-icon>
        Welcome to RegioKI App - Customer Management Panel
      </div>
      <div class="custom-form-container">
        <form [formGroup]="form" class="form">
          <div class="form-clm">
            <div>
              <div class="form-row">
                <mat-form-field class="form-field">
                  <input
                    matInput
                    placeholder="Enter Company Name"
                    formControlName="companyName"
                    required
                    [readonly]="isView"
                  />
                  <mat-error
                    *ngIf="
                      form.get('companyName')?.hasError('required') &&
                      form.get('companyName')?.touched
                    "
                  >
                    Company Name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field class="form-field">
                  <mat-select
                    placeholder="Select Company Type"
                    formControlName="companyType"
                    required
                    readonly="isView"
                  >
                    <ng-container *ngFor="let type of companyTypes">
                      <mat-option [value]="type.id">{{
                        type.attributes.company_type
                      }}</mat-option>
                    </ng-container>
                  </mat-select>
                  <mat-error
                    *ngIf="
                      form.get('companyType')?.hasError('required') &&
                      form.get('companyType')?.touched
                    "
                  >
                    Company Type is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field class="form-field">
                  <input
                    matInput
                    placeholder="Enter Email Account"
                    type="email"
                    formControlName="emailAccount"
                    required
                    [readonly]="isView || isUpdate"
                  />
                  <mat-error
                    *ngIf="
                      form.get('emailAccount')?.hasError('email') &&
                      form.get('emailAccount')?.touched
                    "
                  >
                    Enter a valid email
                  </mat-error>
                  <mat-error
                    *ngIf="
                      form.get('emailAccount')?.hasError('required') &&
                      form.get('emailAccount')?.touched
                    "
                  >
                    Email is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field class="form-field">
                  <mat-select
                    placeholder="Assign AI App"
                    formControlName="aiApp"
                    [disabled]="isView"
                    multiple
                  >
                    <ng-container *ngFor="let app of allAppsList">
                      <mat-option [value]="app.id">{{
                        app.attributes.app_Name
                      }}</mat-option>
                    </ng-container>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field class="form-field">
                  <mat-select
                    placeholder="Active/In-Active"
                    formControlName="status"
                    [disabled]="isView"
                  >
                    <mat-option value="active">active</mat-option>
                    <mat-option value="inactive">inactive</mat-option>
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

                <mat-form-field class="form-field" autocomplete="off">
                  <input
                    matInput
                    [type]="hide ? 'password' : 'text'"
                    formControlName="password"
                    required
                    placeholder="Password"
                    [readonly]="isView"
                  />
                  <mat-icon
                    *ngIf="!isEdgeBrowser"
                    matSuffix
                    (click)="!isView && (hide = !hide)"
                    [ngClass]="{ 'disabled-icon': isUpdate }"
                  >
                    {{ hide ? 'visibility_off' : 'visibility' }}
                  </mat-icon>
                  <mat-error
                    *ngIf="form.get('password')?.hasError('minlength')"
                  >
                    Password must be at least 6 characters long.
                  </mat-error>
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

              <div class="form-row">
                <mat-form-field class="form-field">
                  <input
                    #taxIdInput
                    matInput
                    placeholder="Add TAX ID"
                    formControlName="TaxId"
                    required
                    [readonly]="isView"
                  />
                  <mat-error
                    *ngIf="
                      form.get('TaxId')?.hasError('required') &&
                      form.get('TaxId')?.touched
                    "
                  >
                    Tax ID is required
                  </mat-error>
                  <mat-error *ngIf="form.get('TaxId')?.hasError('maxlength')">
                    Tax ID not More than 11 characters
                  </mat-error>
                  <mat-error *ngIf="form.get('TaxId')?.hasError('pattern')">
                    Tax ID must be numeric
                  </mat-error>
                </mat-form-field>
              </div>
              <mat-form-field class="description-field">
                <textarea
                  matInput
                  placeholder="Write Company Description"
                  rows="4"
                  formControlName="description"
                  [readonly]="isView"
                ></textarea>
              </mat-form-field>
            </div>
            <div>
              <div *ngIf="!isView" class="upload-container">
                <button
                  *ngIf="!appIconUrl && !isView"
                  class="app-icon-preview-1"
                  (click)="triggerFileInput()"
                  mat-raised-button
                >
                  Upload Company Logo
                </button>
                <input
                  type="file"
                  #fileInput
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  hidden
                />
              </div>
              <div class="upload-container">
                <img
                  *ngIf="appIconUrl"
                  [src]="appIconUrl"
                  alt="App Icon"
                  class="app-icon-preview"
                  (click)="triggerFileInput()"
                />

                <mat-icon
                  *ngIf="appIconUrl && !isView"
                  class="edit-icon"
                  (click)="triggerFileInput()"
                >
                  edit
                </mat-icon>
              </div>
            </div>
          </div>
        </form>
      </div>
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
        >
          Update Account
        </button>
        <button
          *ngIf="!isView && !isUpdate"
          class="save-btn"
          mat-raised-button
          [disabled]="form.invalid"
          (click)="openConfirmationDialog('create')"
        >
          Save Account
        </button>
      </div>
    </div>
  `,
  styles: `

  .custom-box {
      border-radius: 22px ;
      background-color: #FFFFFF;
      margin:20px;
      height: 85vh;
      display: flex;
      flex-direction: column;
}


::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within {
    border-color: #008080 !important;
}

::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
    background-color: white !important; /* Background color */
    border-radius: 2px;
    width: 100%;
    border-color:   !important; /* Always green border */
    border: 2px solid #D2D2D2 !important; /* Ensure green border */
}

/* Remove the blue line ripple */
::ng-deep .mdc-text-field--filled .mdc-line-ripple {
    display: none;
}

/* Ensure no outline or box-shadow appears on focus */
::ng-deep .mdc-text-field--filled .mdc-text-field__input {
    outline: none;
    box-shadow: none;
}

/* Force the input field to have a black border by default */
::ng-deep .mdc-text-field--filled {
    border: 2px solid #D2D2D2;
}





/* Hide the default blue ripple on hover */
::ng-deep .mdc-text-field--filled .mdc-line-ripple:hover {
  display: none;
}





      /* To remove the blue line ripple */
      ::ng-deep .mdc-text-field--filled .mdc-line-ripple {
        display: none;

      }
      /* To ensure no outline or box-shadow appears on focus */
      ::ng-deep .mdc-text-field--filled .mdc-text-field__input {
        outline: none;
        box-shadow: none;
      //  color: #008080 !important;
     }

      ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
    /* color: var(--mdc-filled-text-field-label-text-color); */
    color: #D2D2D2 !important;
}

.mat-mdc-option {
    // color:gray !important;
  background:white !important;
}

::ng-deep  .mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
    background-color: #008080 !important;
    border-color: #B5E5E5 !important;
}

.form-clm{
  display:flex;
}

.arrow{
  vertical-align: -5px;
 cursor: pointer;
}

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
      padding: 16px;
      background: #ffffff;
      border-radius: 4px;

    }
    .button-container {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: flex-end;
      margin: auto 20px 20px 0;
    }
    .upload-container{

            border-radius: 8px ;
            border:none;
            margin-left:15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;


    }

    .save-btn {
      width: 15%;
      height:3.3rem;
      margin-left: 10px;
      margin-right:20px;
      background: #008080 !important;
      border-radius: 22px;
      color: white !important;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      cursor: pointer;
      border:none !important;
    }

.logo-upload-btn {
  width: 25vw;
  font-size: 15px;
  border-radius: 22px;
  color: #008080 !important;
  background-color: #00808014 !important;
  border: 1px solid #008080 !important;
}

  .cancel-btn {
    width: 15%;
    height:3.3rem;
    // margin-left: 10px;
    background-color: #00808014 !important;
    // border: 1px solid black;
    border-radius: 22px;
    color: #008080 !important;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    border: 1px solid #008080 !important;
    cursor: pointer;
  border:none;

}
  .app-icon-preview {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.app-icon-preview-1{
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  color:#6C6C6C !important;
  background-color: #F5F5F5 !important;
}
.form {

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.description-field{
   width: 100%;
  height: auto;
  // color:red;
  border-radius: 8px 0px 0px 0px;
  border: 1px solid transparent;
  background-color: transparent;
}
.form-row {
  display: flex;
  background-color: transparent;
  gap: 15px;
  flex-wrap: wrap;
}


.edit-icon {


  color: #008080;

}

.form-field {
   width: 28vw;
height: 20%;
color: #D2D2D2;
border: 1px solid transparent ;
background-color: white;

}

@media (max-width: 1500px){

.form-field {
   width: 20vw;
height: 20%;


}
.app-icon-preview {
  width: 250px;
  height: 200px;

}
.description-field{
   width: 98%;
  height: auto;}
}
.logo-upload-btn {
  width: 20vw;

}
@media (max-width: 600px) {
  .custom-box {
    width: 98%;
     margin: 5px;
  }
  .app-icon-preview{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: auto;
}  .app-icon-preview-1{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: auto;
}
  .heading {
    font-size: 16px;
  }
  .form-clm{
  flex-direction:column;
  margin: 0px auto 30px;
}
  .button-container,.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap:15px
}
  .save-btn ,.cancel-btn {
    width: 100%;
    font-size: 12px;
    margin-left: auto;
  margin-right: auto;

  }
  .logo-upload-btn {
    width: 100%;
  font-size: 12px;
  border-radius: 4px;
}


  .form-row {
    flex-direction: column;

  }

  .form-field {
    width: 100%;
  }
  .description-field{
    width: 100%;
    margin: 20px 0 0 0;

  }
  .mat-select[disabled] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.mat-form-field .mat-form-field-flex {
  background-color: white !important;
  border-radius: 8px 0px 0px 0px;
}
}


`,
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() customerId: null | any;
  appIconFile: File | null = null;
  appIconUrl: string | ArrayBuffer | null = null;
  isUpdate = false;
  isView = false;
  iconChange = false;
  companyTypes: any[] = [];
  allAppsList: any[] = [];
  subs = new Subscription();
  hide = true;
  action!: any;
  isEdgeBrowser!: boolean;
  @ViewChild('taxIdInput') taxIdInput!: ElementRef<HTMLInputElement>;

  constructor(
    private _fb: FormBuilder,
    private _companyService: CompanyService,
    private _snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _appService: AppsService,
    private _companyTypeService: CompanyTypeService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.form = this._fb.group({
      companyName: new FormControl('', Validators.required),
      companyType: new FormControl('', Validators.required),
      emailAccount: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      aiApp: new FormControl(''),
      status: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.minLength(6)]),
      TaxId: new FormControl('de', [
        Validators.required,
        Validators.maxLength(11),
        Validators.pattern(/^[\w\s]*de$/),
      ]),
      description: new FormControl(''),
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // Remove keydown event listener
    const taxIdInput = this.taxIdInput.nativeElement;
    taxIdInput.removeEventListener('keydown', this.onKeyDown.bind(this));
  }
  onKeyDown(event: KeyboardEvent) {
    // Allow only numeric keys and control keys (e.g., Backspace, Tab)
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Enter',
      'Escape',
    ];
    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }

    const isNumeric = /\d/.test(event.key);
    if (!isNumeric) {
      event.preventDefault(); // Prevent non-numeric key
    }
  }
  updateTaxId(value: string) {
    const numericValue = value.replace(/\D/g, '');
    const updatedValue = numericValue.slice(0, 9) + 'de';
    this.form.get('TaxId')?.setValue(updatedValue, { emitEvent: false });
  }
  setCursorToBeforeSuffix() {
    const taxIdControl = this.form.get('TaxId')?.value;
    const inputElement = document.querySelector(
      'input[formControlName="TaxId"]'
    ) as HTMLInputElement;
    if (inputElement) {
      // Set cursor position to before the "de"
      inputElement.setSelectionRange(
        taxIdControl?.length - 2,
        taxIdControl?.length - 2
      );
    }
  }
  ngAfterViewInit(): void {
    // Ensure that the DOM is updated before setting the cursor position
    setTimeout(() => this.setCursorToBeforeSuffix(), 0);
  }

  ngOnInit(): void {
    this.isEdgeBrowser = /Edg|Edge/.test(navigator.userAgent);
    this.form.get('TaxId')?.valueChanges.subscribe((value: string) => {
      if (value && !value.endsWith('de')) {
        this.form
          .get('TaxId')
          ?.setValue(value.replace(/[^0-9]/g, '') + 'de', { emitEvent: false });
        this.updateTaxId(value);
      }
      // Call method to update cursor position
      this.setCursorToBeforeSuffix();
      const taxIdInput = this.taxIdInput.nativeElement;
      taxIdInput.addEventListener('keydown', this.onKeyDown.bind(this));
    });
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      this.customerId = id;
      this.route.url.subscribe((urlSegments) => {
        const url = urlSegments.map((segment) => segment.path).join('/');

        if (url.includes('view-customer') && id) {
          this.isView = true;
        } else if (url.includes('update-customer') && id) {
          this.isUpdate = true;
        }

        // Fetch necessary data for both view and update modes
        if (this.isUpdate || this.isView) {
          const joinSub = forkJoin([
            this._appService.findByQuery('populate=*'),
            this._companyTypeService.findByQuery('populate=*'),
            this._companyService.getCompanyById(id),
          ])
            .pipe(
              map(([appsRes, companyTypesRes, companyRes]) => {
                this.allAppsList = appsRes.data;
                this.companyTypes = companyTypesRes.data;

                const data = companyRes.company;

                // Ensure that Assign AI Apps are correctly mapped
                const aiAppIdsArray = data.Assign_AI_App
                  ? data.Assign_AI_App.flatMap(
                      (assign: AssignAIApp) => assign.apps_id
                    ).map((app: { id: number }) => app.id)
                  : [];

                const companyData = {
                  companyName: data.company_name || '',
                  companyType: data.Company_TypeID?.id || '',
                  emailAccount: data.contact_person || '',
                  aiApp: aiAppIdsArray || '',
                  status: data.company_status || 'inactive',
                  password: data.password || '',
                  TaxId: data.tax_id || '',
                  description: data.description || '',
                };

                // Handle logo/icon retrieval
                this.appIconUrl = data.logo?.url
                  ? `${environment.serverImageUrl}${data.logo.url}`
                  : null;

                // Patch the form with fetched data
                this.form.patchValue(companyData);

                // Disable the form if in view mode
                if (this.isView) {
                  this.form.disable();
                }
              })
            )
            .subscribe();
          this.subs.add(joinSub);
        } else {
          // For cases where no id is provided (e.g., adding a new customer)
          const joinSub = forkJoin([
            this._appService.findByQuery('populate=*'),
            this._companyTypeService.findByQuery('populate=*'),
          ])
            .pipe(
              map(([appsRes, companyTypesRes]) => {
                this.allAppsList = appsRes.data;
                this.companyTypes = companyTypesRes.data;
              })
            )
            .subscribe();
          this.subs.add(joinSub);
        }
      });
    });
  }
  createPayload(): FormData | null {
    if (this.form.valid) {
      const formData = new FormData();
      const formValues = this.form.value;

      formData.append('company_name', formValues.companyName);
      formData.append('address', '');
      formData.append('contact_person', formValues.emailAccount);
      formData.append('tax_id', formValues.TaxId);
      formData.append('company_type', formValues.companyType);
      formData.append('company_status', formValues.status);
      const selectedAppIds = formValues.aiApp || '';

      formData.append('Assign_AI_App', selectedAppIds);
      formData.append('email', formValues.emailAccount);
      formData.append('password', formValues.password);
      formData.append('description', formValues.description);

      if (this.appIconFile) {
        formData.append('logo', this.appIconFile, this.appIconFile.name);
      }

      return formData;
    } else {
      console.error('Form is invalid');
      return null;
    }
  }

  onSubmit(): void {
    const payload = this.createPayload();
    if (payload) {
      this._companyService.createCompany(payload).subscribe(
        (response: any) => {
          this._snackbar.open(`${response.message}`, undefined, {
            duration: 3000,
          });
          if (response.success) {
            this.form.reset();
            this.appIconFile = null;
            this.appIconUrl = '';
            this.router.navigateByUrl('customer-management');
          }
        },
        (error) => {
          console.error('Error creating company:', error);
        }
      );
    }
  }

  updatePayload(): FormData | null {
    if (this.form) {
      const formData = new FormData();
      const formValues = this.form.value;

      formData.append('company_name', formValues.companyName || '');
      formData.append('address', formValues.address || '');
      formData.append('contact_person', formValues.emailAccount || '');
      formData.append('tax_id', formValues.TaxId || '');
      formData.append('company_type', formValues.companyType || '');
      formData.append('company_status', formValues.status || '');
      // const selectedAppIds = formValues.aiApp || '';
      const selectedAppIds = Array.isArray(formValues.aiApp)
        ? formValues.aiApp
        : [];
      if (Array.isArray(selectedAppIds)) {
        selectedAppIds.forEach((appId) => {
          formData.append('Assign_AI_App', appId);
        });
      } else {
        formData.append('Assign_AI_App', selectedAppIds);
      }

      formData.append('email', formValues.emailAccount || '');
      formData.append('password', formValues.password || '');
      formData.append('description', formValues.description || '');

      // If you have a file, append it similarly
      if (this.appIconFile) {
        formData.append('logo', this.appIconFile, this.appIconFile.name);
      }
      return formData;
    } else {
      console.error('Form is invalid');
      return null;
    }
  }

  onUpdate() {
    if (this.customerId) {
      const payload = this.updatePayload();
      if (payload) {
        this._companyService.updateCompany(this.customerId, payload).subscribe(
          (response) => {
            this._snackbar.open(`${response.message}`, undefined, {
              duration: 3000,
            });
            if (response.success) {
              this.form.reset();
              this.appIconFile = null;
              this.appIconUrl = '';
              this.router.navigateByUrl('customer-management');
            }
          },
          (error) => {
            console.error('Error updating company:', error);
          }
        );
      }
    } else {
      console.error('ID is not defined');
    }
  }
  handleSave() {
    if (this.customerId === null || isNaN(this.customerId)) {
      this.onSubmit();
    } else {
      this.onUpdate();
    }
  }
  triggerFileInput(): void {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    fileInput.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.appIconFile = input.files[0];
      this.iconChange = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.appIconUrl = e.target!.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.appIconFile);
    }
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
        if (action === 'update' || action === 'create') {
          this.handleSave();
        }
      }
    });
  }
  goBack() {
    this.router.navigate(['/customer-management']);
  }
}
