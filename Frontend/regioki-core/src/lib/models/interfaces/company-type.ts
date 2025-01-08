import { ICompany } from './company';

/**
 * Model definition for Company_User
 */
export interface ICompany_Type {
  id?: string;
  company_type?: string;
  Companies: ICompany[];
}
