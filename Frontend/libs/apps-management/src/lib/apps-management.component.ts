import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsCreateComponent } from './apps-create/apps-create.component';
import { AppsNavigateComponent } from './apps-navigate/apps-navigate.component';

@Component({
  selector: 'lib-apps-management',
  standalone: true,
  imports: [CommonModule, AppsCreateComponent, AppsNavigateComponent],
  template: `<p>
    <lib-apps-nevigate></lib-apps-nevigate>
  </p>`,
  styles: ``,
})
export class AppsManagementComponent {}
