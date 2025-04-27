import { Component, type OnInit } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTabsModule } from "@angular/material/tabs"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatDividerModule } from "@angular/material/divider"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule } from "@angular/forms"
import  { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { selectAllUsers } from "../users/store/user.selectors"
import { selectAllMusicFiles } from "../music-files/store/music-file.selectors"
import { selectAllPlaylists } from "../playlists/store/playlist.selectors"
import { AppState } from "../store/app.state"
import { MatTooltipModule } from "@angular/material/tooltip"

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
  ],
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent  {
  userCount$: Observable<number>
  musicFileCount$: Observable<number>
  playlistCount$: Observable<number>
  averageFilesPerPlaylist$: Observable<number>

  

  constructor(private store: Store<AppState>) {
    this.userCount$ = this.store.select(selectAllUsers).pipe(map((users) => users.length))
    this.musicFileCount$ = this.store.select(selectAllMusicFiles).pipe(map((files) => files.length))
    this.playlistCount$ = this.store.select(selectAllPlaylists).pipe(map((playlists) => playlists.length))

    this.averageFilesPerPlaylist$ = this.store.select(selectAllPlaylists).pipe(
      map((playlists) => {
        if (playlists.length === 0) return 0
        const totalFiles = playlists.reduce((sum, playlist) => sum + (playlist.songs?.length || 0), 0)
        return Math.round((totalFiles / playlists.length) * 10) / 10
      }),
    )
  }



  getMaxValue(data: any[]): number {
    return Math.max(...data.map((item) => item.count)) * 1.1
  }

  getBarHeight(value: number, maxValue: number): string {
    return `${(value / maxValue) * 100}%`
  }
}
