import { ICompany_App } from './company-app';
import { ICompany_Type } from './company-type';

import { ICompany_User } from './company-user';
/**
 * Model definition for Company
 */
export interface ICompany {
  id: string;
  company_name?: any;
  logo?: any;
  address?: string;
  contact_person?: string;
  tax_id?: number;
  user_count?: number;
  company_users?: ICompany_User[];
  company_apps?: ICompany_App[];
  company_type?: ICompany_Type;
  company_status?: 'active' | 'inactive';
  Assign_AI_App?: ICompany_App[];
  actions?: string;
}
export interface dataEntry {
  id: string;
  name?: any;
  'Ver-Schein-Nr.'?: string;
  VIN?: string;
  Kennzeichen?: string;
  createdAt?: any;
  updatedAt?: any;
  actions?: string;
}
