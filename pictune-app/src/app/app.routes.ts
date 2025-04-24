import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./auth/components/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    loadComponent: () => import("./dashboard/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      {
        path: "users",
        loadComponent: () =>
          import("./users/components/user-list/user-list.component").then((m) => m.UserListComponent),
      },
      {
        path: "users/new",
        loadComponent: () =>
          import("./users/components/user-form/user-form.component").then((m) => m.UserFormComponent),
      },
      {
        path: "users/edit/:id",
        loadComponent: () =>
          import("./users/components/user-form/user-form.component").then((m) => m.UserFormComponent),
      },
      {
        path: "music-files",
        loadComponent: () =>
          import("./music-files/components/music-file-list/music-file-list.component").then(
            (m) => m.MusicFileListComponent,
          ),
      },

      {
        path: "music-files/edit/:id",
        loadComponent: () =>
          import("./music-files/components/music-file-form/music-file-form.component").then(
            (m) => m.MusicFileFormComponent,
          ),
      },
      {
        path: "playlists",
        loadComponent: () =>
          import("./playlists/components/playlist-list/playlist-list.component").then((m) => m.PlaylistListComponent),
      },
      {
        path: "playlists/new",
        loadComponent: () =>
          import("./playlists/components/playlist-form/playlist-form.component").then((m) => m.PlaylistFormComponent),
      },
      {
        path: "playlists/edit/:id",
        loadComponent: () =>
          import("./playlists/components/playlist-form/playlist-form.component").then((m) => m.PlaylistFormComponent),
      },
    ],
  },
  { path: "**", redirectTo: "" },
]

