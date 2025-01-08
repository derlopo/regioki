import { ISubscription } from './subscription';

/**
 * Model definition for Subscription_Type
 */
export interface ISubscription_Type {
  id?: string;
  plan_type?: 'standard' | 'premium';
  package_cost?: number;
  subscription_duration?: number;
  subscription?: ISubscription;
}
