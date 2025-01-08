import { IApp } from './app';
import { ICompany } from './company';

/**
 * Model definition for Company_App
 */
export interface ICompany_App {
  id?: string;
  connected_at?: Date;
  company_id?: ICompany;
  apps_id?: IApp[];
}
