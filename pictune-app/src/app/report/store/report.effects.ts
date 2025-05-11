import { inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as ReportActions from './report.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export class ReportEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(ApiService);

  loadReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.loadReport),
      mergeMap(() =>
        this.apiService.getReportSummary().pipe(
          map((response) =>
            ReportActions.loadReportSuccess({
              users: response.users,
              music: response.music,
            })
          ),
          catchError((error) =>
            of(ReportActions.loadReportFailure({ error }))
          )
        )
      )
    )
  );
}
