import { Component, inject } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { SupabaseService } from "../../supabase.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  private readonly supabase = inject(SupabaseService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  private readonly snackBar = inject(MatSnackBar)

  loading = false
  loginForm: FormGroup

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.loginForm.get("email")?.value
      const password = this.loginForm.get("password")?.value

      const { error } = await this.supabase.signIn(email, password)

      if (error) throw error

      this.router.navigate(["/dashboard"])
    } catch (error: any) {
      this.snackBar.open(error.error_description || error.message, "Close", {
        duration: 5000,
      })
    } finally {
      this.loading = false
    }
  }
}

