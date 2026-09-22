export type Category = 'praise' | 'suggestion' | 'complaint' | 'grievance';

export type ServiceType =
  | 'help_desk'
  | 'tax_clearance'
  | 'pdcr'
  | 'file_transfer'
  | 'personal_pan'
  | 'business_pan'
  | 'business_close'
  | 'business_deregistration'
  | 'scheme_apply'
  | 'vat_adjustment'
  | 'due_clearance'
  | 'bank_reactivation'
  | 'tax_audit'
  | 'investigation'
  | 'complaint'
  | 'others';

export type WaitingTime =
  | 'within_10_min'
  | '10min_30min'
  | '30min_1hr'
  | 'more_than_1hr'
  | '1_day'
  | '2_days'
  | 'more_than_3_days';

export interface Feedback {
  id: string;
  code: string;
  serviceType: ServiceType;
  isAnonymous: boolean;
  name: string;
  pan: string;
  contact: string;
  email: string;
  dateOfVisit: string;
  category: Category;
  overallService: number;
  staffBehavior: number;
  waitingTime: WaitingTime | '';
  description: string;
  submittedAt: string;
  response: string;
}
