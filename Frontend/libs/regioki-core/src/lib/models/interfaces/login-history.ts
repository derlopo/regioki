import { IAdministrator } from './administrator';
import { ICompany_User } from './company-user';
// import { IUser } from './user';

/**
 * Model definition for Login_History
 */
export interface ILogin_History {
  id?: string;
  login_time?: Date;
  logout_time?: Date;
  ip_address?: string;
  device_name?: string;
  // user_id?: IUser;
  company_user_id?: ICompany_User;
  administrator_id?: IAdministrator;
}
