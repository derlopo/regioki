/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { environment as adminEnv } from '@env/environment';
import { environment as customerEnv } from '@env/customer/environment';
import { NavItem } from '../../../../layout/src/lib/navItems.interface';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  generatePDF$ = new BehaviorSubject(false);

  getEnvUrl(): string {
    const storedData = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    return storedData?.user?.company_user
      ? customerEnv.serverUrl
      : adminEnv.serverUrl;
  }

  getCurrentUser() {
    const currentUser = JSON.parse(
      localStorage.getItem('userDetails') as string
    );
    return currentUser;
  }

  getAdminItems(): NavItem[] {
    return [
      {
        title: 'Dashboard',
        routeURL: '/dashboard',
        imageUrl: './assets/dashboard.svg',
      },
      {
        title: 'Customer Management',
        routeURL: '/customer-management',
        imageUrl: './assets/Customer-managment.svg',
      },
      {
        title: 'Managing AI Apps',
        routeURL: '/apps-list',
        imageUrl: '../assets/Manage-Ai-Apps.svg',
      },
      {
        title: 'Settings',
        routeURL: '',
        imageUrl: '../../assets/settings.svg',
      },
    ];
  }

  getCustomerItems(): NavItem[] {
    return [
      {
        title: 'My AI Apps',
        routeURL: '/my-ai-apps',
        imageUrl: './assets/dashboard.svg',
      },
    ];
  }

  convertToCSV(jsonArray: any) {
    const keys = Object.keys(jsonArray[0]);
    const csvRows = [];

    // Add the header row (keys)
    csvRows.push(keys.join(','));

    // Add the data rows
    jsonArray.forEach((obj: any) => {
      const values = keys.map((key) => obj[key]);
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  generateFileNameWithCurrentTime(fileName: string) {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format: YYYY-MM-DD_HH-MM-SS (you can change this as needed)
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

    return `${fileName}_${timestamp}.csv`; // Example file name with timestamp
  }
  generateAndDownloadCSV(jsonData: any, fileName: string): void {
    const csv = this.convertToCSV(jsonData);
    this.downloadCSV(csv, fileName);
  }
}
