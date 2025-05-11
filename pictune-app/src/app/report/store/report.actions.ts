import { createAction, props } from '@ngrx/store';

export const loadReport = createAction(
  '[Report] Load Report',
  props<{ timeRange: 'week' | 'month' | 'year' }>()
);
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
export interface StatPointUpload {
  hour: number;
  count: number;
}

export const loadUploadsByHour = createAction('[Report] Load Uploads By Hour');

export const loadUploadsByHourSuccess = createAction(
  '[Report] Load Uploads By Hour Success',
  props<{ data: StatPointUpload[] }>()
);

export const loadUploadsByHourFailure = createAction(
  '[Report] Load Uploads By Hour Failure',
  props<{ error: any }>()
);
