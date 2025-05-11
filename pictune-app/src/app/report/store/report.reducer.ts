import { createReducer, on } from "@ngrx/store";
import { StatPoint, loadReport, loadReportSuccess, loadReportFailure, loadUploadsByHourFailure, loadUploadsByHour, loadUploadsByHourSuccess } from "./report.actions";

export interface ReportState {
  users: StatPoint[];
  music: StatPoint[];
  uploadsByHour: { hour: number; count: number }[]; // 🆕
  loading: boolean;
  error: any;
}

export const initialState: ReportState = {
  users: [],
  music: [],
  uploadsByHour: [], 
  loading: false,
  error: null,
};

export const reportReducer = createReducer(
  initialState,
  on(loadReport, (state) => ({ ...state, loading: true })),
  on(loadReportSuccess, (state, { users, music }) => ({
    ...state,
    users,
    music,
    loading: false,
  })),
  on(loadReportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // 🆕 upload stats
  on(loadUploadsByHour, (state) => ({ ...state, loading: true })),
  on(loadUploadsByHourSuccess, (state, { data }) => ({
    ...state,
    uploadsByHour: data,
    loading: false,
  })),
  on(loadUploadsByHourFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
