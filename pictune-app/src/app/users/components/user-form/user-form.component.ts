import { Component, type OnInit } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import  { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import type { User } from "../../models/user.model"
import * as UserActions from "../../store/user.actions"
import { selectSelectedUser, selectUserLoading } from "../../store/user.selectors"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup
  userId: string | null = null
  isEditMode = false
  loading$: Observable<boolean>
  selectedUser$: Observable<User | null>

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.loading$ = this.store.select(selectUserLoading)
    this.selectedUser$ = this.store.select(selectSelectedUser)
  }

  ngOnInit(): void {
    this.initForm()

    this.userId = this.route.snapshot.paramMap.get("id")
    this.isEditMode = !!this.userId

    if (this.isEditMode && this.userId) {
      this.store.dispatch(UserActions.loadUser({ id: this.userId }))

      this.selectedUser$.subscribe((user) => {
        if (user) {
          this.userForm.patchValue({
            userName: user.userName,
            email: user.email,
          })
        }
      })
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
    })

    // Add password field only for new users
    if (!this.isEditMode) {
      this.userForm.addControl("password", this.formBuilder.control("", [Validators.required, Validators.minLength(6)]))
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return
    }

    if (this.isEditMode && this.userId) {
      this.store.dispatch(
        UserActions.updateUser({
          id: this.userId,
          user: {
            userName: this.userForm.value.userName,
            email: this.userForm.value.email,
          },
        }),
      )
    } else {
      this.store.dispatch(
        UserActions.createUser({
          user: this.userForm.value,
        }),
      )
    }
  }

  onCancel(): void {
    this.router.navigate(["/users"])
  }
}

