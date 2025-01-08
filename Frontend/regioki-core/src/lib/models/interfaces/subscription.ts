import { ICompany_User } from './company-user';
import { ISubscription_Type } from './subscription-type';

/**
 * Model definition for Subscription
 */
export interface ISubscription {
  id?: string;
  Subscription_package_name?: string;
  last_renewed_at?: Date;
  subscription_type_id?: ISubscription_Type[];
  company_user_id?: ICompany_User;
  subscription_status?: 'active' | 'inactive';
}
