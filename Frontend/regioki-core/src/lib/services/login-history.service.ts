/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';

import { UtilityService } from './utility.service';
import { ILogin_History } from '../models/interfaces';
import { ENTITYPLURALNAMES } from '../models/constant';

@Injectable({
  providedIn: 'root',
})
export class LoginHistoryService extends CrudService<ILogin_History, string> {
  constructor(
    protected override _http: HttpClient,
    utilService: UtilityService
  ) {
    super(
      _http,
      `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.LOGIN_HISTORIES}`
    );
  }
}
