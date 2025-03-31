import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { MatListModule } from "@angular/material/list"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-sidenav",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.css",
})
export class SidenavComponent {
  menuItems = [
    { name: "Users", icon: "people", route: "/dashboard/users" },
    { name: "Music Files", icon: "library_music", route: "/dashboard/music-files" },
  ]
}

