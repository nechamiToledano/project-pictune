import { Component, type OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { Store } from "@ngrx/store"
import { AppState } from "./store/app.state"
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "pictune-app"
  constructor(private store: Store<AppState>) {

    const token = typeof window!=='undefined'?localStorage.getItem('token'):null;
    if (token) {
      this.store.dispatch(AuthActions.autoLogin());
    }

  }


}

