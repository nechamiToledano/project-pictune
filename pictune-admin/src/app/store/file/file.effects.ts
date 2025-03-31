import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as FileActions from './file.actions';
import { File } from './file.model';

@Injectable()
export class FileEffects {
  private apiUrl = 'http://localhost:5000/api/files';

  constructor(private actions$: Actions, private http: HttpClient) {}

  loadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.loadFiles),
      mergeMap(() =>
        this.http.get<File[]>(this.apiUrl).pipe(
          map(files => FileActions.loadFilesSuccess({ files })),
          catchError(error =>
            of(FileActions.loadFilesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.addFile),
      mergeMap(action =>
        this.http.post<File>(this.apiUrl, action.file).pipe(
          map(file => FileActions.addFileSuccess({ file })),
          catchError(error =>
            of(FileActions.addFileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.deleteFile),
      mergeMap(action =>
        this.http.delete(`${this.apiUrl}/${action.fileId}`).pipe(
          map(() => FileActions.deleteFileSuccess({ fileId: action.fileId })),
          catchError(error =>
            of(FileActions.deleteFileFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
