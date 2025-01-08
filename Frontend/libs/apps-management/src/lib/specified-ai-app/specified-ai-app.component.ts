import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppsService } from '@regio-ki/regioki-core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataEntryAppComponent } from '@regio-ki/data-entry-app';
@Component({
  selector: 'lib-specified-ai-app',
  standalone: true,
  imports: [CommonModule, MatIconModule, DataEntryAppComponent],
  template: `
    <div class="container">
      <ng-container *ngIf="!isSystemApp; else systemAppTemplate">
        <div class="heading">
          <mat-icon class="arrow" (click)="goBack()"> arrow_back_ios </mat-icon>
          {{ appDetails?.attributes?.app_Name }}
        </div>
        <div class="usecaseapp-container">
          <ng-container *ngIf="!hasError; else errorTemplate">
            <object
              *ngIf="!hasError"
              [data]="chatGptUrl"
              type="text/html"
              (load)="onObjectLoad()"
              (error)="onObjectError()"
              style="width: 100%; height: 600px;"
            ></object>
          </ng-container>
          <ng-template #errorTemplate>
            <div class="error-container">
              <p>
                Something went wrong. The content could not be loaded due to Url
                that do not exists.
              </p>
            </div>
          </ng-template>
        </div>
      </ng-container>

      <ng-template #systemAppTemplate>
        <lib-data-entry-app [appDetails]="appDetails"></lib-data-entry-app>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .heading {
        font-family: 'Poppins', sans-serif;
        font-size: 32px;
        font-weight: 600;
        line-height: 30px;
        text-align: left;
        color: #2f3e3e;
        padding: 10px 20px;
        align-items: center;
        display: flex;
        flex-direction: row;
      }
      .arrow {
        margin-top: 5px;
        padding-bottom: 10px;
        cursor: pointer;
        font-size: 30px;
        margin-right: 10px;
      }
      .usecaseapp-container {
        margin: 1rem;
        border-radius: 1rem;
        margin: 2rem;
      }
      .iframe {
        border-radius: 1rem;
      }
      .error-container {
        color: blue;
        text-align: center;
        padding: 1rem;
        border: 1px solid blue;
        border-radius: 1rem;
      }
    `,
  ],
})
export class SpecifiedAiAppComponent implements OnInit {
  chatGptUrl!: SafeResourceUrl;
  hasError = false;

  appDetails!: any;
  isSystemApp = false;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _appService: AppsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');

      this._appService.findOne(id, '?populate[app_Icon]=*').subscribe(
        (res) => {
          this.appDetails = res.data;

          if (this.appDetails?.attributes?.system_app) {
            this.isSystemApp = true;
          } else {
            const url = this.appDetails?.attributes?.App_URL;

            if (
              !url ||
              !(url.startsWith('http://') || url.startsWith('https://'))
            ) {
              this.hasError = true;
              return;
            }

            this.chatGptUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        },
        (err) => {
          this.hasError = true;
        }
      );
    });
  }

  onObjectLoad() {
    this.hasError = false;
  }

  onObjectError() {
    this.hasError = true;
  }

  goBack() {
    this.router.navigate(['/my-ai-apps']);
  }
}
