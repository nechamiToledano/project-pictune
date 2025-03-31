import { Component, Inject, inject } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { Store } from "@ngrx/store"
import type { AppState } from "../../store/app.state"
import type { File } from "../../store/file.model"
import * as FileActions from "../../store/file.actions"
import { SupabaseService } from "../../supabase.service"

@Component({
  selector: "app-music-file-form",
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: "./music-file-form.component.html",
  styleUrl: "./music-file-form.component.css",
})
export class MusicFileFormComponent {
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store<AppState>)
  private readonly supabase = inject(SupabaseService)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialogRef = inject(MatDialogRef<MusicFileFormComponent>)

  fileForm: FormGroup
  loading = false
  isEditMode = false
  selectedFile: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: File) {
    this.isEditMode = !!data.id;
    
    this.fileForm = this.fb.group({
      id: [data.id || ''],
      name: [data.name || '', [Validators.required]],
      type: [data.type || 'audio'],
      size: [data.size || 0],
      url: [data.url || '']
    });
  }

  async onSubmit() {
    if (this.fileForm.invalid) return

    try {
      this.loading = true

      // If a new file was selected, upload it first
      if (this.selectedFile && !this.isEditMode) {
        const fileExt = this.selectedFile.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await this.supabase.uploadMusicFile(filePath, this.selectedFile)

        if (uploadError) throw uploadError

        const fileUrl = this.supabase.getMusicFileUrl(filePath)

        this.fileForm.patchValue({
          url: fileUrl,
          name: this.selectedFile.name,
          size: this.selectedFile.size,
        })
      }

      const fileData = this.fileForm.value

      this.store.dispatch(FileActions.addFile({ file: fileData }))

      this.snackBar.open(`File ${this.isEditMode ? "updated" : "created"} successfully`, "Close", { duration: 3000 })

      this.dialogRef.close(true)
    } catch (error: any) {
      this.snackBar.open(error.message, "Close", {
        duration: 5000,
      })
    } finally {
      this.loading = false
    }
  }

  onFileSelected(event: any) {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    this.selectedFile = event.target.files[0]

    // Check if file is a music file
    const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/aac"]
    if (!validTypes.includes(this.selectedFile.type)) {
      this.snackBar.open("Please select a valid music file", "Close", {
        duration: 3000,
      })
      this.selectedFile = null
      return
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}

