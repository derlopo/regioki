import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppsService } from '@regio-ki/regioki-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '@regio-ki/material';

@Component({
  selector: 'lib-images-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    MaterialModule,
  ],
  template: `
    <h2 mat-dialog-title>Upload Images</h2>
    <mat-dialog-content>
      <div class="image-upload-container">
        <div class="image-preview-container">
          <!-- <div *ngFor="let image of images" class="image-item">
            <img [src]=" image.url" class="image-preview" />
            </div> -->
          <div *ngFor="let preview of imagePreviews" class="image-item">
            <img [src]="preview" class="image-preview" />
          </div>
          <div class="add-image-item">
            <button mat-icon-button (click)="onAddImageClick(fileInput)">
              <mat-icon>add</mat-icon>
            </button>
            <input
              type="file"
              (change)="onFileSelected($event)"
              accept="image/*"
              #fileInput
              style="display: none;"
              multiple
            />
          </div>
        </div>
      </div>
      <div *ngIf="uploadProgress">
        <mat-progress-bar
          mode="determinate"
          [value]="uploadProgress"
        ></mat-progress-bar>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-button
        class="mat-btn"
        mat-dialog-close
        [disabled]="isUploading"
      >
        Cancel
      </button>
      <button
        mat-button
        class="mat-btn"
        (click)="onUpload()"
        [disabled]="!selectedFiles.length || isUploading"
      >
        <ng-container *ngIf="isUploading">
          <mat-spinner diameter="20" class="custom-spinner"></mat-spinner>
        </ng-container>
        <ng-container *ngIf="!isUploading"> Process Images </ng-container>
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .image-upload-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .image-preview-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .image-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .image-preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .add-image-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: #f5f5f5;
      }
      mat-icon {
        margin-top: auto !important;
      }
      ::ng-deep .custom-spinner .mat-progress-spinner circle,
      ::ng-deep .custom-spinner .mat-spinner circle {
        stroke: white !important; /* Force the color to be white */
      }
      mat-progress-bar {
        margin-top: 30px;
        width: 100% !important;
      }
      .mat-btn {
        margin-top: 30px;
        background-color: #5d5fef !important;
        color: white !important;
        width: 30%;
      }
    `,
  ],
})
export class ImagesUploadComponent {
  isUploading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  uploadProgress = 0;
  images: any;
  constructor(
    private _appService: AppsService,
    private _snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<ImagesUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.images = data.images;
  }

  ngOnInit(): void {
    console.log('Received images:', this.images);
    // Additional initialization logic if needed
  }
  onAddImageClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles.push(...files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  uploadedBlobs: Blob[] = [];

  onUpload(): void {
    if (this.selectedFiles.length > 0) {
      this.uploadProgress = 0;
      this.isUploading = true;
      // Convert files to Blob format and store them in the array
      this.uploadedBlobs = this.selectedFiles.map(
        (file) => new Blob([file], { type: file.type })
      );

      const formData = new FormData();
      this.uploadedBlobs.forEach((blob, index) => {
        formData.append('files', blob, this.selectedFiles[index].name);
      });

      this._appService.getExtractedDataNew(formData).subscribe(
        (res: any) => {
          this.dialogRef.close({
            extractedDetails: res.responseText,
            images: this.imagePreviews,
            slectedImgFile: this.selectedFiles,
          });
          this.isUploading = false;
        },
        (err) => {
          this._snackbar.open('something went wrong', undefined, {
            duration: 2000,
          });
          this.isUploading = false;
        }
      );
    }
  }
}
