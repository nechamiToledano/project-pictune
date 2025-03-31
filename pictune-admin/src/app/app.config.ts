import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { fileReducer } from './store/file/file.reducer';
import { FileEffects } from './store/file/file.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideStore({ file: fileReducer }),  // Provide the store
    provideEffects(FileEffects),  // Provide NgRx effects
  ],
};
