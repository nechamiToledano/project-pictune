import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { map, take, catchError, of } from "rxjs"
import { selectUser } from "../../auth/store/auth.selectors"
import { AppState } from "../../store/app.state"
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return store.select(selectUser).pipe(
    take(1),
    map((user) => {
      
      if (user && user.roles?.includes('Admin')) {
        
        return true;
      }      
      return router.createUrlTree(['/login']);
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
