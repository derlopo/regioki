import { ICompany_App } from './company-app';
import { ICompany_User } from './company-user';

/**
 * Model definition for User_App_Authorization
 */
export interface IUser_App_Authorization {
  id?: string;
  authorized_at?: Date;
  company_user?: ICompany_User;
  company_app?: ICompany_App;
}
