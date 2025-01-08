import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  getCompanyTypes() {
    return [
      {
        name: 'Technology',
        value: 'Technology',
      },
      {
        name: 'Healthcare',
        value: 'Healthcare',
      },
      {
        name: 'Finance & Banking',
        value: 'Finance & Banking',
      },
      {
        name: 'Energy',
        value: 'Energy',
      },
      {
        name: 'Consumer Goods',
        value: 'Consumer Goods',
      },
      {
        name: 'Telecommunications',
        value: 'Telecommunications',
      },
      {
        name: 'Industrial',
        value: 'Industrial',
      },
    ];
  }
}
