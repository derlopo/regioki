import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { UtilityService } from './utility.service';
import { ENTITYPLURALNAMES } from '../models/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService extends CrudService<any, string> {
  constructor(
    protected override _http: HttpClient,
    private utilService: UtilityService
  ) {
    super(
      _http,
      `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.DYNAMIC_FORMS}`
    );
  }
  override findByQuery(queryParams: string): Observable<any> {
    const url = `${this.utilService.getEnvUrl()}/dynamic-forms/custom-find?${queryParams}`;
    return this._http.get<any>(url);
  }

  uploadImgDynamic(data: any): Observable<any> {
    return this._http.post<any>(`${this.utilService.getEnvUrl()}/upload`, data);
  }
}
