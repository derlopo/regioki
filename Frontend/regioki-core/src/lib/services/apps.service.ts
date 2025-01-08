/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';

import { UtilityService } from './utility.service';
import { IApp } from '../models/interfaces';
import { ENTITYPLURALNAMES } from '../models/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppsService extends CrudService<IApp, string> {
  constructor(
    protected override _http: HttpClient,
    private utilService: UtilityService
  ) {
    super(_http, `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.APPS}`);
  }

  createApp(appData: any): Observable<any> {
    return this._http.post<any>(`${this._base}`, appData);
  }
  findAllApps(): Observable<any> {
    return this._http.get<any>(`${this._base}`);
  }
  uploadImg(data: any) {
    return this._http.post<any>(`${this.utilService.getEnvUrl()}/upload`, data);
  }

  getAppsByCompanyId(id: string) {
    return this._http.get(`${this._base}/get-apps-by-company-id?id=${id}`);
  }

  getExtractedData(files: any) {
    return this._http.post(
      `${this.utilService.getEnvUrl()}/process-image`,
      files
    );
  }

  getExtractedDataNew(files: any) {
    return this._http.post(
      `${this.utilService.getEnvUrl()}/process-image-new`,
      files
    );
  }

  setAsWegas(data: any) {
    return this._http.post(
      `${this.utilService.getEnvUrl()}/run-api-interaction`,
      { data }
    );
  }
}
