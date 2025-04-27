import type { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginGuard } from "./core/guards/login.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./auth/components/login/login.component").then((m) => m.LoginComponent),
    canActivate: [LoginGuard],
  },
  {
    path: "",
    loadComponent: () => import("./dashboard/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      {
        path: "users",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./users/components/user-list/user-list.component").then((m) => m.UserListComponent),
          },
          {
            path: "new",
            loadComponent: () =>
              import("./users/components/user-form/user-form.component").then((m) => m.UserFormComponent),
          },
          {
            path: "edit/:id",
            loadComponent: () =>
              import("./users/components/user-form/user-form.component").then((m) => m.UserFormComponent),
          },
        ],
      },
      {
        path: "music-files",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./music-files/components/music-file-list/music-file-list.component").then(
                (m) => m.MusicFileListComponent,
              ),
          },
          {
            path: "edit/:id",
            loadComponent: () =>
              import("./music-files/components/music-file-form/music-file-form.component").then(
                (m) => m.MusicFileFormComponent,
              ),
          },
        ],
      },
      {
        path: "playlists",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./playlists/components/playlist-list/playlist-list.component").then((m) => m.PlaylistListComponent),
          },
          {
            path: "new",
            loadComponent: () =>
              import("./playlists/components/playlist-form/playlist-form.component").then((m) => m.PlaylistFormComponent),
          },
          {
            path: "edit/:id",
            loadComponent: () =>
              import("./playlists/components/playlist-form/playlist-form.component").then((m) => m.PlaylistFormComponent),
          },
        ],
      },
      {
        path: "analytics",
        loadComponent: () => import("./analytics/analytics.component").then((m) => m.AnalyticsComponent),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
