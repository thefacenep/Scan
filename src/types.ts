export type Category = 'praise' | 'suggestion' | 'complaint' | 'grievance';

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
  isAnonymous: boolean;
  name: string;
  pan: string;
  contact: string;
  dateOfVisit: string;
  category: Category;
  overallService: number;
  staffBehavior: number;
  waitingTime: WaitingTime | '';
  description: string;
  submittedAt: string;
  response: string;
}
