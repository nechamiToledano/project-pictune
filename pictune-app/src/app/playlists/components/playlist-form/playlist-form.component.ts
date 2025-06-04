import { Component, type OnInit } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import  { Store } from "@ngrx/store"
import type { Observable, Subscription } from "rxjs"
import * as PlaylistActions from "../../store/playlist.actions"
import { selectSelectedPlaylist, selectPlaylistLoading } from "../../store/playlist.selectors"
import { Playlist } from "../../models/playlist/playlist.model"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-playlist-form",
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./playlist-form.component.html",
  styleUrls: ["./playlist-form.component.scss"],
})
export class PlaylistFormComponent implements OnInit {
  playlistForm!: FormGroup
  playlistId: number | null = null
  isEditMode = false
  loading$: Observable<boolean>
  selectedPlaylist$: Observable<Playlist | null>
  private playlistSub!: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.loading$ = this.store.select(selectPlaylistLoading)
    this.selectedPlaylist$ = this.store.select(selectSelectedPlaylist)
  }

  ngOnInit(): void {
    this.initForm()

    const idParam = this.route.snapshot.paramMap.get("id")
    if (idParam) {
      this.playlistId = +idParam
      this.isEditMode = true

      this.store.dispatch(PlaylistActions.loadPlaylist({ id: this.playlistId }))

      this.playlistSub = this.selectedPlaylist$.subscribe((playlist: Playlist | null) => {
        if (playlist && playlist.id === this.playlistId) {
          this.playlistForm.patchValue({
            name: playlist.name,
            description: playlist.description,
          })
        }
      })
    }
  }

  initForm(): void {
    this.playlistForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: [""],
    })
  }

  onSubmit(): void {
    if (this.playlistForm.invalid) {
      return
    }

    if (this.isEditMode && this.playlistId) {
      this.store.dispatch(
        PlaylistActions.updatePlaylist({
          id: this.playlistId,
          playlist: {
            name: this.playlistForm.value.name as string,
            description: this.playlistForm.value.description as string,
          },
        })
      )
    } else {
      this.store.dispatch(
        PlaylistActions.createPlaylist({
          playlist: {
            name: this.playlistForm.value.name as string,
            description: this.playlistForm.value.description as string,
          },
        })
      )
    }
  }

  onCancel(): void {
    this.router.navigate(["/playlists"])
  }

  ngOnDestroy(): void {
    if (this.playlistSub) {
      this.playlistSub.unsubscribe()
    }
  }
}
