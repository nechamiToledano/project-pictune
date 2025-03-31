import { Component, EventEmitter, Output, inject } from "@angular/core"
import { Router } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatMenuModule } from "@angular/material/menu"
import { SupabaseService } from "../../supabase.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>()

  private readonly supabase = inject(SupabaseService)
  private readonly router = inject(Router)

  async signOut() {
    await this.supabase.signOut()
    this.router.navigate(["/login"])
  }
}

