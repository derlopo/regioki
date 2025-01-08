/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';

import { UtilityService } from './utility.service';
import { ISubscription_Type } from '../models/interfaces';
import { ENTITYPLURALNAMES } from '../models/constant';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionTypeService extends CrudService<
  ISubscription_Type,
  string
> {
  constructor(
    protected override _http: HttpClient,
    utilService: UtilityService
  ) {
    super(
      _http,
      `${utilService.getEnvUrl()}/${ENTITYPLURALNAMES.SUBSCRIPTION_TYPES}`
    );
  }
}
