import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { MatSidenavModule } from "@angular/material/sidenav"
import { HeaderComponent } from "../shared/header/header.component"
import { SidenavComponent } from "../shared/sidenav/sidenav.component"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidenavComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  sidenavOpened = true

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened
  }
}

