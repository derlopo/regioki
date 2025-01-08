import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@regio-ki/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfirmDialogConfig } from '@regio-ki/regioki-core';
@Component({
  selector: 'lib-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="dialog-container">
      <div
        class="icon-div"
        [ngClass]="{
          'delete-action': action === 'delete',
          'update-action': action === 'update' || action === 'create'
        }"
      >
        <span *ngIf="action === 'delete'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            class="delete-svg"
          >
            <path
              d="M14.25 3.03905H11.925C11.5662 1.29425 10.0313 0.0413125 8.24998 0.0390625H6.74996C4.96863 0.0413125 3.43378 1.29425 3.07498 3.03905H0.749988C0.335777 3.03905 0 3.37483 0 3.78904C0 4.20325 0.335777 4.53906 0.749988 4.53906H1.49998V14.2891C1.50247 16.3591 3.17995 18.0366 5.24999 18.0391H9.74999C11.82 18.0366 13.4975 16.3591 13.5 14.2891V4.53906H14.25C14.6642 4.53906 15 4.20329 15 3.78907C15 3.37486 14.6642 3.03905 14.25 3.03905ZM6.75 12.7891C6.75 13.2033 6.41422 13.5391 6.00001 13.5391C5.58577 13.5391 5.24999 13.2033 5.24999 12.7891V8.28907C5.24999 7.87486 5.58576 7.53909 5.99998 7.53909C6.41419 7.53909 6.74996 7.87486 6.74996 8.28907V12.7891H6.75ZM9.74999 12.7891C9.74999 13.2033 9.41421 13.5391 9 13.5391C8.58579 13.5391 8.25001 13.2033 8.25001 12.7891V8.28907C8.25001 7.87486 8.58579 7.53909 9 7.53909C9.41421 7.53909 9.74999 7.87486 9.74999 8.28907V12.7891ZM4.62825 3.03905C4.94726 2.14077 5.79677 1.5402 6.75 1.53904H8.25001C9.20324 1.5402 10.0528 2.14077 10.3718 3.03905H4.62825Z"
              fill="#649999"
            />
          </svg>
        </span>
        <span *ngIf="action === 'update' || action === 'create'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            class="update-svg"
          >
            <path
              d="M9 5.25V0.345C9.68475 0.6045 10.3147 1.00425 10.8488 1.5375L13.4618 4.152C13.9958 4.68525 14.3955 5.31525 14.655 6H9.75C9.336 6 9 5.66325 9 5.25ZM9.9525 14.61C9.34275 15.2197 9 16.0463 9 16.9088V18H10.0912C10.9537 18 11.7803 17.6573 12.39 17.0475L17.4953 11.9423C18.168 11.2695 18.168 10.1775 17.4953 9.50475C16.8225 8.832 15.7305 8.832 15.0577 9.50475L9.9525 14.61ZM7.5 16.9088C7.5 15.6398 7.99425 14.4465 8.89125 13.5495L13.9965 8.44425C14.2882 8.1525 14.628 7.92825 14.9948 7.7685C14.9917 7.6785 14.988 7.58925 14.982 7.49925H9.75C8.5095 7.49925 7.5 6.48975 7.5 5.24925V0.018C7.37925 0.00975 7.2585 0 7.13625 0H3.75C1.68225 0 0 1.68225 0 3.75V14.25C0 16.3177 1.68225 18 3.75 18H7.5V16.9088Z"
              fill="#649999"
            />
          </svg>
        </span>
      </div>
      <h2 mat-dialog-title>{{ data.confirmationMessage }}</h2>

      <mat-dialog-content *ngIf="data.errorMessage" class="error-message">
        {{ data.errorMessage }}
      </mat-dialog-content>

      <mat-dialog-content *ngIf="data.successMessage" class="success-message">
        {{ data.successMessage }}
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button class="cancel-btn" (click)="onCancelClick()">
          No
        </button>
        <button
          mat-raised-button
          [ngClass]="getConfirmButtonClass()"
          (click)="onConfirmClick()"
        >
          Yes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `

  ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
  padding: 30px;
  border-radius: 20px !important;
  max-height: 95vh !important;
}

mat-icon{
  color:red;
  width:35px;
  height:35px;
}

::ng-deep .mat-mdc-dialog-actions {
  display: flex;
  justify-content:space-between;
  width:100%;
  flex-wrap: wrap;
  padding: 12px;  

  button{
    width: 135px;
    padding: 10px 25px 10px 25px;
    gap: 14px;
    border-radius: 18px;
    opacity: 1px;
  }
}
 .dialog-container {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    .delete-action{
      background:#FFF3F3;
    }
    .update-action{
      background: #E5F2F2;
    }
    h2{
      text-align:center;
    }
  .icon-div {
    width: 114px;
    height: 114px;
    border-radius:50%;
    overflow:hidden;
    display:flex;
    align-items:center;
    justify-content:center;
       svg {
      width: 50px; /* Adjust width */
      height: 50px; /* Adjust height */
    }

      .delete-svg path {
        fill: #EC4344; 
      }

      .update-svg path {
        fill: #008080; 
      }

  }
  .cancel-btn{
    background: #F4F4F4;
    color: black;
  }
  }
  .confirm-update{
      background: #008080 !important;
      color: white !important;
    }
    .confirm-create{
      background: #008080 !important;
      color: white !important;
    }

    .confirm-delete {
      background: #EC4344 !important;
      color: white !important;
    }
    @media (max-width: 400px) {
      button{
    width: 100%;
    margin-top:15px;
  }
    }
  `,
})
export class ConfirmationDialogComponent {
  action!: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogConfig
  ) {
    console.log('Data', data);
    this.action = data.action || ''; // Assuming action is passed in the data
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  getConfirmButtonClass(): string {
    if (this.action === 'update') {
      return 'confirm-update';
    } else if (this.action === 'create') {
      return 'confirm-create';
    } else if (this.action === 'delete') {
      return 'confirm-delete';
    }
    return '';
  }
}
