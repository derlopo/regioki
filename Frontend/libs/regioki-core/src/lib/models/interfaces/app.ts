import { REGIOKI_SYSTEM_APPS_Enum } from '../enum';
import { IAI_Token } from './ai-token';
import { ICompany_App } from './company-app';
// import { IUser } from './user';

/**
 * Model definition for App
 */
export interface IApp {
  title?: any;
  icons?: any;
  id?: string;
  app_Name?: string;
  app_Description?: string;
  App_Instructions?: string;
  App_URL?: string;
  company_apps?: ICompany_App[];
  token_id?: IAI_Token;
  app_Icon?: any;
  isRegioKiSystemApp?: boolean;
  system_app?: REGIOKI_SYSTEM_APPS_Enum.dataEntryApp | null;
  // users?: IUser[];
}
