import { AuthState } from "../auth/store/auth.reducer"
import { MusicFileState } from "../music-files/store/music-file.reducer"
import { PlaylistState } from "../playlists/store/playlist.reducer"
import { UserState } from "../users/store/user.reducer"

export interface AppState {
  auth: AuthState
  users: UserState
  musicFiles: MusicFileState
  playlists: PlaylistState
}