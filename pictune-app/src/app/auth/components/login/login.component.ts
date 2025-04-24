import { Component, type OnInit } from "@angular/core"
import {  FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import  { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import { AsyncPipe } from "@angular/common"
import * as AuthActions from "../../store/auth.actions"
import { selectError, selectIsLoading } from "../../store/auth.selectors"
import { BackgroundComponent } from "../../../core/components/background/background/background.component"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BackgroundComponent
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  loading$: Observable<boolean>
  error$: Observable<string | null>
  hidePassword = true

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
  ) {
    this.loading$ = this.store.select(selectIsLoading)
    this.error$ = this.store.select(selectError)
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    const { username, password } = this.loginForm.value as {
      username: string
      password: string
    }

    this.store.dispatch(
      AuthActions.login({
        request: { userName: username, password },
      }),
    )
  }
}

