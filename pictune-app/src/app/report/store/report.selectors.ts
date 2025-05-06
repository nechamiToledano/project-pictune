// report.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportState } from './report.reducer';

export const selectReportState = createFeatureSelector<ReportState>('report');

export const selectUserStats = createSelector(
  selectReportState,
  (state) => state.users
);

export const selectMusicStats = createSelector(
  selectReportState,
  (state) => state.music
);

export const selectReportLoading = createSelector(
  selectReportState,
  (state) => state.loading
);
