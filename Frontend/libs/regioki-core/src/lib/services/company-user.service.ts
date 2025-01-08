/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';

import { UtilityService } from './utility.service';
import { ICompany_User } from '../models/interfaces';
import { ENTITYPLURALNAMES } from '../models/constant';
import { Observable } from 'rxjs';
import { Payload } from '../models/interfaces/payload';

@Injectable({
  providedIn: 'root',
})
export class CompanyUserService extends CrudService<ICompany_User, string> {
  constructor(
    protected override _http: HttpClient,
    utilService: UtilityService
  ) {
    super(
      _http,
      `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.COMPANY_USERS}`
    );
  }


  createCompanyUser(payload: FormData): Observable<Payload<any>> {
    return this._http.post<Payload<any>>(`${this._base}/createUserForCompany`, payload);
  }

  updateCompanyUser(id: number, companyUserData: any): Observable<any> {
    return this._http.put<any>(`${this._base}/updateUserForCompany/${id}`, companyUserData);
  }
  deleteCompanyUser(id: any): Observable<any> {
    return this._http.delete<any>(`${this._base}/deleteUserForCompany/${id}`);
  }
}
