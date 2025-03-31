import { Injectable } from "@angular/core"
import { type AuthChangeEvent, createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js"
import { BehaviorSubject, type Observable } from "rxjs"
import { environment } from "./environments/environment"

export interface Profile {
  id?: string
  username: string
  email: string
  avatar_url?: string
  created_at?: string
}

export interface MusicFile {
  id?: string
  title: string
  artist: string
  album?: string
  genre?: string
  file_url: string
  file_name: string
  file_size: number
  duration?: number
  created_at?: string
  updated_at?: string
  user_id: string
}

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient
  private _session: Session | null = null
  private _userSubject = new BehaviorSubject<User | null>(null)

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
      if (data.session?.user) {
        this._userSubject.next(data.session.user)
      }
    })
  }

  get session() {
    return this._session
  }

  get user$(): Observable<User | null> {
    return this._userSubject.asObservable()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      this._session = session
      if (session?.user) {
        this._userSubject.next(session.user)
      } else {
        this._userSubject.next(null)
      }
      callback(event, session)
    })
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  // User management
  async getUsers() {
    return this.supabase.from("profiles").select("*").order("created_at", { ascending: false })
  }

  async getUserById(id: string) {
    return this.supabase.from("profiles").select("*").eq("id", id).single()
  }

  async updateUser(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date().toISOString(),
    }

    return this.supabase.from("profiles").upsert(update).eq("id", profile.id)
  }

  async deleteUser(id: string) {
    return this.supabase.from("profiles").delete().eq("id", id)
  }

  // Music file management
  async getMusicFiles() {
    return this.supabase.from("music_files").select("*").order("created_at", { ascending: false })
  }

  async getMusicFileById(id: string) {
    return this.supabase.from("music_files").select("*").eq("id", id).single()
  }

  async createMusicFile(musicFile: MusicFile) {
    const newFile = {
      ...musicFile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return this.supabase.from("music_files").insert(newFile)
  }

  async updateMusicFile(musicFile: MusicFile) {
    const update = {
      ...musicFile,
      updated_at: new Date().toISOString(),
    }

    return this.supabase.from("music_files").update(update).eq("id", musicFile.id)
  }

  async deleteMusicFile(id: string) {
    return this.supabase.from("music_files").delete().eq("id", id)
  }

  // Storage operations
  async uploadMusicFile(filePath: string, file: File) {
    return this.supabase.storage.from("music_files").upload(filePath, file)
  }

  async downloadMusicFile(path: string) {
    return this.supabase.storage.from("music_files").download(path)
  }

  getMusicFileUrl(path: string) {
    return this.supabase.storage.from("music_files").getPublicUrl(path).data.publicUrl
  }

  async uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from("avatars").upload(filePath, file)
  }

  getAvatarUrl(path: string) {
    return this.supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
  }
}

