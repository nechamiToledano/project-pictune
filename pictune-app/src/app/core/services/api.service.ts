import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { environment } from "../../../enviroments/enviroment"
import { HttpClient } from "@angular/common/http"
import { StatPointUpload } from "../../report/store/report.actions"
import { log } from "node:console"
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl


  // Auth endpoints
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signin`, { userName: username, password })
  }

  // User endpoints
  getUsers(): Observable<any[]> {
    console.log('getusers');
    
    return this.http.get<any[]>(`${this.apiUrl}/users`)
  }

  getUserProfile(id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`)
    
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, user)
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`)
  }

  // Music file endpoints
  getMusicFiles(owner?: boolean, favorites?: boolean): Observable<any[]> {
    let url = `${this.apiUrl}/files`
    const params: any = {}

    if (owner !== undefined) {
      params.owner = owner
    }

    if (favorites !== undefined) {
      params.favorites = favorites
    }

    // Add query parameters if they exist
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams()
      for (const key in params) {
        queryParams.set(key, params[key])
      }
      url += `?${queryParams.toString()}`
    }

    return this.http.get<any[]>(url)
  }

  getMusicFile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/files/${id}`)
  }

  updateMusicFile(id: number, file: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/files/${id}`, file)
  }

  deleteMusicFile(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/files/${id}`)
  }

  getMusicFileUrl(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/files/${id}/play`)
  }

  toggleLike(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/files/${id}/like`, {})
  }

  extractImage(fileKey: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/extract-image?fileKey=${fileKey}`, {
      responseType: "blob",
    })
  }

  // Playlist endpoints (assuming similar structure to the other controllers)
  getPlaylists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/playlists`)
  }

  getPlaylist(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/playlists/${id}`)
  }

  createPlaylist(playlist: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/playlists`, playlist)
  }

  updatePlaylist(id: number, playlist: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/playlists/${id}`, playlist)
  }

  deletePlaylist(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/playlists/${id}`)
  }

  addToPlaylist(playlistId: number, musicFileId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/playlists/${playlistId}/files/${musicFileId}`, {})
  }

  removeFromPlaylist(playlistId: number, musicFileId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/playlists/${playlistId}/files/${musicFileId}`)
  }
  getReportSummary(timeRange:string) {
  
    return this.http.get<{ users: any[]; music: any[] }>(`${this.apiUrl}/reports/summary?range=${timeRange}`);
  }
  getUploadsByHour(): Observable<StatPointUpload[]> {
    
    const res= this.http.get<StatPointUpload[]>(`${this.apiUrl}/reports/uploads-by-hour`);
    console.log(res);
    
return res;
  }

}




