import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'uc-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  template: `<mat-toolbar color="primary">
    <mat-toolbar-row>
      <span>Custom Toolbar</span>
    </mat-toolbar-row>

    <mat-toolbar-row>
      <span>Second Line</span>
      <span class="example-spacer"></span>
      <mat-icon
        class="example-icon"
        aria-hidden="false"
        aria-label="Example user verified icon"
        >verified_user</mat-icon
      >
    </mat-toolbar-row>

    <mat-toolbar-row>
      <span>Third Line</span>
      <span class="example-spacer"></span>
      <mat-icon
        class="example-icon"
        aria-hidden="false"
        aria-label="Example heart icon"
        >favorite</mat-icon
      >
      <mat-icon
        class="example-icon"
        aria-hidden="false"
        aria-label="Example delete icon"
        >delete</mat-icon
      >
    </mat-toolbar-row>
  </mat-toolbar> `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class FooterComponent {}
