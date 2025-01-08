import { ILogin_History } from './login-history';
// import { IUser } from './user';

/**
 * Model definition for Administrator
 */
export interface IAdministrator {
  id?: string;
  First_Name?: string;
  Last_Name?: string;
  login_histories?: ILogin_History[];
  // user_id?: IUser;
}
