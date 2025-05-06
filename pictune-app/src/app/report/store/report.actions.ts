import { createAction, props } from '@ngrx/store';

export const loadReport = createAction('[Report] Load Report');
export const loadReportSuccess = createAction(
  '[Report] Load Report Success',
  props<{ users: StatPoint[]; music: StatPoint[] }>()
);
export const loadReportFailure = createAction(
  '[Report] Load Report Failure',
  props<{ error: any }>()
);

export interface StatPoint {
  date: string;
  count: number;
}
