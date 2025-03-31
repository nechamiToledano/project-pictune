import { Component, type OnInit, ViewChild, inject } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import type { AppState } from "../store/app.state"
import type { File } from "../store/file.model"
import * as FileActions from "../store/file.actions"
import { MusicFileFormComponent } from "./music-file-form/music-file-form.component"

@Component({
  selector: "app-music-files",
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: "./music-files.component.html",
  styleUrl: "./music-files.component.css",
})
export class MusicFilesComponent implements OnInit {
  private readonly store = inject(Store<AppState>)
  private readonly dialog = inject(MatDialog)
  private readonly snackBar = inject(MatSnackBar)

  displayedColumns: string[] = ["name", "type", "size", "actions"]
  dataSource = new MatTableDataSource<File>([])
  loading = false
  files$: Observable<File[]>
  error$: Observable<string | null>

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor() {
    this.files$ = this.store.select((state) => state.files.files)
    this.error$ = this.store.select((state) => state.files.error)
  }

  ngOnInit() {
    this.loadFiles()

    this.files$.subscribe((files) => {
      this.dataSource.data = files
    })

    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, "Close", {
          duration: 5000,
        })
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadFiles() {
    this.loading = true
    this.store.dispatch(FileActions.loadFiles())
    setTimeout(() => (this.loading = false), 1000) // Simulate loading time
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  openMusicFileForm(file?: File) {
    const dialogRef = this.dialog.open(MusicFileFormComponent, {
      width: "500px",
      data: file || {},
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFiles()
      }
    })
  }

  deleteFile(fileId: string) {
    if (confirm("Are you sure you want to delete this file?")) {
      this.store.dispatch(FileActions.deleteFile({ fileId }))
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

