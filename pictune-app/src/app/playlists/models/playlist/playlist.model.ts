import { MusicFile } from "../../../music-files/models/music-file.model"

export interface Playlist {
  id: number
  name: string
  description: string
  userId: string
  createdAt: string
  songs?: MusicFile[]
}

export interface CreatePlaylistDto {
  name: string
  description: string
}

export interface UpdatePlaylistDto {
  name: string
  description: string
}

