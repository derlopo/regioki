/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';

import { UtilityService } from './utility.service';
import { ENTITYPLURALNAMES } from '../models/constant';
import { ICompany_Type } from '../models/interfaces/company-type';

@Injectable({
  providedIn: 'root',
})
export class CompanyTypeService extends CrudService<ICompany_Type, string> {
  constructor(
    protected override _http: HttpClient,
    utilService: UtilityService
  ) {
    super(
      _http,
      `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.COMPANY_TYPES}`
    );
  }
}
