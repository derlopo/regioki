import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '@regio-ki/layout';
@Component({
  standalone: true,
  imports: [RouterModule, LayoutComponent],
  selector: 'app-root',
  template: '<uc-layout></uc-layout>',
  styles: '',
})
export class AppComponent {
  title = 'RegioKI-Customer';
}
