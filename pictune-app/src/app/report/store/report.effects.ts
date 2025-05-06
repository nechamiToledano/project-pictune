import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import * as ReportActions from './report.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export const loadReport$ = createEffect((actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(ReportActions.loadReport),
    mergeMap(() =>
      inject(ApiService).getReportSummary().pipe(
        map((response) =>
          ReportActions.loadReportSuccess({
            users: response.users,
            music: response.music,
          })
        ),
        catchError((error) => of(ReportActions.loadReportFailure({ error })))
      )
    )
  )
);
