import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Server },
  { path: '', renderMode: RenderMode.Server },
  { path: 'users', renderMode: RenderMode.Server },
  { path: 'users/new', renderMode: RenderMode.Server },
  { path: 'users/edit/:id', renderMode: RenderMode.Server },
  { path: 'music-files', renderMode: RenderMode.Server },
  { path: 'music-files/edit/:id', renderMode: RenderMode.Server },
  { path: 'playlists', renderMode: RenderMode.Server },
  { path: 'playlists/new', renderMode: RenderMode.Server },
  { path: 'playlists/edit/:id', renderMode: RenderMode.Server },
  { path: 'analytics', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
