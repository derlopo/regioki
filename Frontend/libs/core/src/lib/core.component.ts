import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-core',
  standalone: true,
  imports: [CommonModule],
  template: `<p>core works!</p>`,
  styles: ``,
})
export class CoreComponent {}
