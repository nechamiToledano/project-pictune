import type { FileState } from "./file.reducer"
import type { UserState } from "./user.reducer"

export interface AppState {
  files: FileState
  users: UserState
}

