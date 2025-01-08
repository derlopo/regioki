/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Observable } from 'rxjs';
import { UtilityService } from './utility.service';
import { ICompany } from '../models/interfaces';
import { ENTITYPLURALNAMES } from '../models/constant';
import { Payload } from '../models/interfaces/payload';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends CrudService<ICompany, string> {
  constructor(
    protected override _http: HttpClient,
    utilService: UtilityService
  ) {
    super(_http, `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.COMPANIES}`);
  }
  getCompaniesDetails(): Observable<any> {
    return this._http.get<any>(this._base);
  }

  getCompaniesDetailsPaginated(
    page: number,
    pageSize: number,
    filter = '',
    sortField = 'createdAt',
    sortDirection: 'asc' | 'desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('pagination[page]', page.toString())
      .set('pagination[pageSize]', pageSize.toString())
      .set('filters[$or][0][company_name][$containsi]', filter)
      .set('filters[$or][1][id][$containsi]', filter)
      .set('sort', `${sortField}:${sortDirection}`)
      .set('populate', 'logo,Company_TypeID');

    return this._http.get<any>(this._base, { params });
  }

  deleteCompany(id: any): Observable<any> {
    return this._http.delete(`${this._base}/deleteCompany/${id}`);
  }
  loginCompany(data: any): Observable<any> {
    return this._http.post<any>(`${this._base}/login`, {
      data,
    });
  }
  createCompany(payload: FormData): Observable<Payload<any>> {
    return this._http.post<Payload<any>>(
      `${this._base}/createCompany`,
      payload
    );
  }

  updateCompany(id: number, companyData: any): Observable<any> {
    return this._http.put<any>(
      `${this._base}/update_Company/${id}`,
      companyData
    );
  }
  getCompanyById(id: number): Observable<any> {
    return this._http.get<any>(`${this._base}/companies_Detail/${id}`);
  }
}

