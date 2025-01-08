import { ICompany } from './company';
import { ILogin_History } from './login-history';
import { ISubscription } from './subscription';
// import { IUser } from './user';

/**
 * Model definition for Company_User
 */
export interface ICompany_User {
  id?: string;
  email: string;
  First_Name?: string;
  Last_Name?: string;
  status: string;
  subscriptions?: ISubscription[];
  company_id?: ICompany;
  login_histories?: ILogin_History[];
  // user_id?: IUser;
}
