import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppComponent } from './app/app.component';
import { fileReducer } from './app/store/file/file.reducer';
import { FileEffects } from './app/store/file/file.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore({ files: fileReducer }),
    provideEffects([FileEffects]),
  ],
}).catch(err => console.error(err));
