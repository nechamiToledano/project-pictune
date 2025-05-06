import { createReducer, on } from '@ngrx/store';
import * as ReportActions from './report.actions';

export interface ReportState {
  users: ReportActions.StatPoint[];
  music: ReportActions.StatPoint[];
  loading: boolean;
  error: any;
}

export const initialState: ReportState = {
  users: [],
  music: [],
  loading: false,
  error: null,
};

export const reportReducer = createReducer(
  initialState,
  on(ReportActions.loadReport, (state) => ({ ...state, loading: true })),
  on(ReportActions.loadReportSuccess, (state, { users, music }) => ({
    ...state,
    users,
    music,
    loading: false,
  })),
  on(ReportActions.loadReportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
