import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppsService } from '@regio-ki/regioki-core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IApp } from 'libs/regioki-core/src/lib/models/interfaces';
import { environment } from '@env/environment';
import { MaterialModule } from '@regio-ki/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { REGIOKI_SYSTEM_APPS } from 'libs/regioki-core/src/lib/models/constant';

@Component({
  selector: 'lib-apps-create',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="heading">
        <mat-icon class="arrow" (click)="goBack()"> arrow_back_ios </mat-icon>
        Manage AI Apps / {{ isUpdate ? 'Update ' : 'Create ' }}AI Apps
      </div>
      <div class="icon-container">
        <!-- Icon is displayed only if no image is uploaded -->
        <mat-icon *ngIf="!appIconUrl" (click)="triggerFileInput()"
          >add_circle_outline</mat-icon
        >

        <!-- Hidden file input -->
        <input
          type="file"
          #fileInput
          accept="image/*"
          (change)="onFileSelected($event)"
          hidden
          required
        />

        <!-- Image preview and Edit icon -->
        <div *ngIf="appIconUrl">
          <img
            [src]="appIconUrl"
            alt="App Icon"
            class="img-container"
            required
            (click)="!isView && clearImage()"
          />
          <!-- Edit icon to reset the image -->
          <mat-icon class="clear-img-btn" *ngIf="!isView" (click)="clearImage()"
            >edit</mat-icon
          >
        </div>
      </div>

      <form [formGroup]="aiForm" [ngClass]="{ 'disabled-form': isView }">
        <mat-form-field>
          <input
            matInput
            formControlName="app_Name"
            placeholder="Name your AI App"
            required="true"
          />
          <mat-error
            *ngIf="
              aiForm.get('app_Name')?.hasError('required') &&
              aiForm.get('app_Name')?.touched
            "
          >
            App name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <input
            matInput
            formControlName="app_Description"
            placeholder="Add a short Description about what AI App does"
            required="true"
          />
          <mat-error
            *ngIf="
              aiForm.get('app_Description')?.hasError('required') &&
              aiForm.get('app_Description')?.touched
            "
          >
            Description is required
          </mat-error>
        </mat-form-field>

        <div class="flex column">
          <mat-slide-toggle
            class="toggle-btn"
            [checked]="isRegioKiSystemApp"
            [disabled]="isView"
            (change)="changeDefaultApp($event)"
          >
            Is RegioKi System APP?
          </mat-slide-toggle>

          <ng-container *ngIf="!isRegioKiSystemApp; else systemAppList">
            <mat-form-field>
              <input
                matInput
                formControlName="App_URL"
                placeholder="https://regioki.com"
                [required]="!isRegioKiSystemApp"
                [readonly]="isRegioKiSystemApp || isView"
              />
              <mat-error
                *ngIf="
                  aiForm.get('App_URL')?.hasError('required') &&
                  aiForm.get('App_URL')?.touched
                "
              >
                URL is required
              </mat-error>
            </mat-form-field>
          </ng-container>

          <ng-template #systemAppList>
            <mat-form-field class="form-field">
              <mat-select
                placeholder="Select System App"
                formControlName="system_app"
                required
                readonly="isView"
              >
                <ng-container *ngFor="let app of defaultApps">
                  <mat-option [value]="app">{{ app }}</mat-option>
                </ng-container>
              </mat-select>
              <mat-error
                *ngIf="
                  aiForm.get('system_app')?.hasError('required') &&
                  aiForm.get('system_app')?.touched
                "
              >
                System App is required
              </mat-error>
            </mat-form-field>
          </ng-template>
        </div>

        <mat-form-field>
          <textarea
            matInput
            formControlName="App_Instructions"
            placeholder="What does this AI App do? How does it behave? What should it perform Actions?"
            required="true"
          ></textarea>
          <mat-error
            *ngIf="
              aiForm.get('App_Instructions')?.hasError('required') &&
              aiForm.get('App_Instructions')?.touched
            "
          >
            Instructions is required
          </mat-error>
        </mat-form-field>

        <div *ngIf="!isView" class="button-group">
          <button mat-flat-button class="btns" (click)="onCancel()">
            Cancel
          </button>
          <button
            mat-flat-button
            class="btns"
            *ngIf="isUpdate"
            (click)="onUpdate()"
          >
            Update
          </button>
          <button
            mat-flat-button
            class="btns"
            [disabled]="aiForm.invalid"
            *ngIf="!isUpdate"
            (click)="onSubmit()"
          >
            Create
          </button>
        </div>
      </form>

      <button
        mat-flat-button
        *ngIf="isView"
        class="custom-green-btn"
        (click)="onCancel()"
      >
        Cancel
      </button>
    </div>
  `,
  styles: `
  .container {
  // max-width: 600px;
  // margin: 0 auto;
  margin-right: 30px;
  margin-top: 20px;
  margin-left: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within {
    border-color: #008080 !important;
}
  mat-label {
        color: #D2D2D2 !important;
      }

::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
    background-color: white !important; /* Background color */
    border-radius: 12px;
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
    border: 1px solid black;
}


::ng-deep .mdc-switch__track::after{
  background-color: #008080 !important;
}

::ng-deep .custom-green-btn.mat-mdc-unelevated-button:not(:disabled) {
  background-color: #008080 !important;
  color: white !important;
}
// ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled):focus-within .mdc-line-ripple {
//   background-color: green !important;
// }

/* Hide the default blue ripple on hover */
::ng-deep .mdc-text-field--filled .mdc-line-ripple:hover {
  display: none;
}
.button-group .btns {
        padding: 10px 42px 10px 42px;
        gap: 8px;
        border-radius: 18px;
        background: #008080;
        margin-right: 15px;
      }
.disabled-form {
  pointer-events: none;
  opacity: 0.6;
}

.btns:disabled {
  opacity: 0.5;
  color:white;
}

.img-container{
  text-align: center;
  margin-bottom: 20px;
  display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius:100%;
    width: 150px;
  height: 150px

}
.icon-container {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
    justify-content: center;
    align-items: center;
    color: silver;
    width: 60%;
    flex-direction: column;
}

.arrow{
 vertical-align: middle;
cursor: pointer;
font-size: 25px;
font-weight: 600;
color: #2F3E3E;
}
.heading {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 600;
      line-height: 50px;
      color: #2F3E3E;
      padding: 10px 20px;

    }
mat-icon {
  font-size: 170px;
  display: contents;
  color : silver
  // color: #ffcc00;
}

.clear-img-btn{
  font-size:20px;
  display: contents;
  color :  #008080;

}
.app-icon-preview {
      max-width: 100px;
      max-height: 100px;
      border-radius: 50%;
      margin-bottom: 20px;
      display: block;
      margin: 0 auto 20px auto;
    }

mat-form-field {
  width: 60%;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
justify-content: flex-end;
}

button {
  min-width: 100px;
}
.icon-preview {
  text-align: center;
  margin-bottom: 20px;
}

.icon-preview img {
  width: 120px;
  height: auto;
  border-radius: 10%;
  border: 2px solid #ccc;
}
@media (max-width: 768px) {
  .icon-container {
    width: 100%;
}
/* your-component.component.scss */
mat-form-field {
  width: 100%;
}

textarea {
  min-height: 150px;
  padding: 10px;
  line-height: 1.5;
}

.button-group  {
flex-direction:column;
gap:12px

 }

}

  .toggle-btn{
    margin:  0 0 20px
  }
  `,
})
export class AppsCreateComponent implements OnInit {
  aiForm: FormGroup;
  appIconFile: File | null = null;
  appIconUrl: string | ArrayBuffer | null = null;

  isUpdate = false;
  isView = false;
  iconChange = false;
  isRegioKiSystemApp = false;
  defaultApps = REGIOKI_SYSTEM_APPS;

  constructor(
    private fb: FormBuilder,
    private appsService: AppsService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar
  ) {
    this.aiForm = this.fb.group({
      app_Name: [''],
      app_Description: [''],
      App_URL: [''],
      App_Instructions: [''],
      App_Icon: [''],
      system_app: [''],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');

      // Check if the URL contains 'app-update'
      this.route.url.subscribe((urlSegments) => {
        const url = urlSegments.map((segment) => segment.path).join('/');
        if (url.includes('app-update') && id) {
          this.isUpdate = true;
          this.fetchAppData(id);
        }
        if (url.includes('app-view') && id) {
          this.isView = true;
          this.fetchAppData(id);
        }
      });
    });
  }
  appid: any;
  clearImage() {
    this.triggerFileInput(); // Trigger the file input again if needed
  }

  fetchAppData(id: string): void {
    this.appsService.findOne(id, `?populate=*`).subscribe({
      next: (response: any) => {
        const data = response.data?.attributes;
        this.appid = response.data?.id;

        this.isRegioKiSystemApp = data.isRegioKiSystemApp;

        this.addRemoveUrlValidations();
        this.aiForm.patchValue({
          app_Name: data.app_Name,
          app_Description: data.app_Description,
          App_URL: data.App_URL,
          App_Instructions: data.App_Instructions,
          system_app: data.system_app,
        });
        if (data.app_Icon && data.app_Icon.data) {
          this.appIconUrl = data.app_Icon.data?.attributes?.url
            ? `${environment.serverImageUrl}${data.app_Icon.data.attributes.url}`
            : null;
          this.appIconFile = data.app_Icon.data;
        }
      },
      error: (err) => {
        console.error('Error fetching app data:', err);
      },
    });
  }

  onSubmit(): void {
    // Check if the form is valid and if a file has been selected
    if (this.aiForm.valid && this.appIconFile) {
      const formValue = this.aiForm.value;
      const payload = {
        data: {
          app_Name: formValue.app_Name,
          app_Description: formValue.app_Description,
          App_URL: this.isRegioKiSystemApp ? null : formValue.App_URL,
          App_Instructions: formValue.App_Instructions,
          app_Icon: this.appIconFile,
          system_app: this.isRegioKiSystemApp ? formValue.system_app : null,
          isRegioKiSystemApp: this.isRegioKiSystemApp,
        },
      };

      this.appsService.createApp(payload).subscribe({
        next: (res) => {
          this.uploadIcon(res.data.id);
          this.aiForm.reset();
          this._snackbar.open('App created successfully', undefined, {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error creating app:', err);
        },
      });
    } else {
      // If form is invalid or file is not present, show an error message
      if (!this.appIconFile) {
        this._snackbar.open(
          'Please select a file for the app icon',
          undefined,
          {
            duration: 3000,
          }
        );
      }
      this.aiForm.markAllAsTouched(); // Mark form fields as touched to trigger validation messages
    }
  }
  onCancel() {
    this.aiForm.reset();
    this.router.navigateByUrl('apps-list');
  }
  uploadIcon(id: any) {
    const data = new FormData();
    if (this.appIconFile) {
      data.append('files', this.appIconFile, this.appIconFile?.name);
      data.append('refId', id);
      data.append('ref', 'api::app.app');
      data.append('field', 'app_Icon');
      this.appsService.uploadImg(data).subscribe((res: any) => {
        if (res) {
          console.log('File Uploaded');
        }
        this.router.navigateByUrl('apps-list');
      });
    }
  }

  triggerFileInput(): void {
    if (this.isView) {
      return;
    }
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
      };
      reader.readAsDataURL(this.appIconFile);
    }
  }
  onUpdate() {
    if (this.aiForm.valid) {
      const formValue = this.aiForm.value;
      const payload: IApp = {
        app_Name: formValue.app_Name,
        app_Description: formValue.app_Description,
        App_URL: formValue.App_URL,
        App_Instructions: formValue.App_Instructions,
        app_Icon: this.appIconFile == null ? this.appIconUrl : this.appIconFile, // Assuming app_Icon is of type File | null in IApp
        isRegioKiSystemApp: this.isRegioKiSystemApp,
        system_app: this.isRegioKiSystemApp ? formValue.system_app : null,
      };

      this.appsService.update(this.appid, payload).subscribe({
        next: (res) => {
          if (this.iconChange) {
            this.uploadIcon(res.data.id);
          } else {
            this.router.navigateByUrl('apps-list');
          }
          this.aiForm.reset();
          this._snackbar.open('App updated successfully', undefined, {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error updating app:', err);
        },
      });
    }
  }

  changeDefaultApp(event: MatSlideToggleChange): void {
    this.isRegioKiSystemApp = event.checked;

    this.addRemoveUrlValidations();

    this.aiForm.controls['App_URL'].reset();
    this.aiForm.controls['system_app'].reset();
  }

  addRemoveUrlValidations(): void {
    if (this.isRegioKiSystemApp) {
      this.aiForm.controls['App_URL'].clearValidators(); // Clears all validators
      this.aiForm.controls['App_URL'].updateValueAndValidity();

      this.aiForm.controls['system_app'].setValidators([Validators.required]);
      this.aiForm.controls['system_app'].updateValueAndValidity();
    } else {
      this.aiForm.controls['system_app'].clearValidators(); // Clears all validators
      this.aiForm.controls['system_app'].updateValueAndValidity();

      this.aiForm.controls['App_URL'].setValidators([Validators.required]);
      this.aiForm.controls['App_URL'].updateValueAndValidity();
    }
  }
  goBack() {
    this.router.navigate(['/apps-management']);
  }
}
