import { Component, type OnInit } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import {  FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import  { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import type { MusicFile } from "../../models/music-file.model"
import * as MusicFileActions from "../../store/music-file.actions"
import { selectSelectedMusicFile, selectMusicFileLoading } from "../../store/music-file.selectors"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-music-file-form",
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
  templateUrl: "./music-file-form.component.html",
  styleUrls: ["./music-file-form.component.scss"],
})
export class MusicFileFormComponent implements OnInit {
  musicFileForm!: FormGroup
  musicFileId: number | null = null
  loading$: Observable<boolean>
  selectedMusicFile$: Observable<MusicFile | null>

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.loading$ = this.store.select(selectMusicFileLoading)
    this.selectedMusicFile$ = this.store.select(selectSelectedMusicFile)
  }

  ngOnInit(): void {
    this.initForm()

    const idParam = this.route.snapshot.paramMap.get("id")
    if (idParam) {
      this.musicFileId = +idParam

      this.store.dispatch(MusicFileActions.loadMusicFile({ id: this.musicFileId }))

      this.selectedMusicFile$.subscribe((musicFile) => {
        if (musicFile) {
          this.musicFileForm.patchValue({
            displayName: musicFile.displayName,
          })
        }
      })
    }
  }

  initForm(): void {
    this.musicFileForm = this.formBuilder.group({
      displayName: ["", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.musicFileForm.invalid) {
      return
    }

    if (this.musicFileId) {
      this.store.dispatch(
        MusicFileActions.updateMusicFile({
          id: this.musicFileId,
          musicFile: {
            displayName: this.musicFileForm.value.displayName
          },
        }),
      )
    }
  }

  onCancel(): void {
    this.router.navigate(["/music-files"])
  }
}



