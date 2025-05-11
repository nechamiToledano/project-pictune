import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';


import { authInterceptor } from './core/interceptors/auth-interceptor';

import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(), // חייב להיות כדי ש־inject יפעל בתוך HttpInterceptorFn
      withInterceptors([authInterceptor]) // ✅ עטוף את ה־Interceptor בתוך withInterceptors
    ),
    provideStore(appReducers),
    provideEffects(appEffects),
    provideStoreDevtools(),
    provideAnimations()
  ],
};
