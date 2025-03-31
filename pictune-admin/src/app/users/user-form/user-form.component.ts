import { Component, Inject, inject } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { Store } from "@ngrx/store"
import type { AppState } from "../../store/app.state"
import type { User } from "../../store/user.model"
import * as UserActions from "../../store/user.actions"

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.css",
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store<AppState>)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>)

  userForm: FormGroup
  loading = false
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {
    this.isEditMode = !!data.id;
    
    this.userForm = this.fb.group({
      id: [data.id || ''],
      name: [data.name || '', [Validators.required]],
      email: [data.email || '', [Validators.required, Validators.email]],
      role: [data.role || 'user']
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return

    try {
      this.loading = true
      const userData = this.userForm.value

      if (this.isEditMode) {
        this.store.dispatch(UserActions.updateUser({ user: userData }))
      } else {
        this.store.dispatch(UserActions.addUser({ user: userData }))
      }

      this.snackBar.open(`User ${this.isEditMode ? "updated" : "created"} successfully`, "Close", { duration: 3000 })

      this.dialogRef.close(true)
    } catch (error: any) {
      this.snackBar.open(error.message, "Close", {
        duration: 5000,
      })
    } finally {
      this.loading = false
    }
  }
}

