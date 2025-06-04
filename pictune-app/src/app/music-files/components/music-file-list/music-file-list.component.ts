import { Component, type OnInit, ViewChild, AfterViewInit } from "@angular/core"
import { AsyncPipe, DatePipe } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import {  MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatTooltipModule } from "@angular/material/tooltip"
import { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import type { MusicFile } from "../../models/music-file.model"
import * as MusicFileActions from "../../store/music-file.actions"
import { selectAllMusicFiles, selectMusicFileLoading, selectMusicFileUrlById } from "../../store/music-file.selectors"
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-music-file-list",
  standalone: true,
  imports: [
  
    AsyncPipe,
    DatePipe,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: "./music-file-list.component.html",
  styleUrls: ["./music-file-list.component.scss"],
})
export class MusicFileListComponent implements OnInit, AfterViewInit {
  
  displayedColumns: string[] = ["id", "displayName", "uploadDate", "actions"]
  dataSource = new MatTableDataSource<MusicFile>([])
  loading$: Observable<boolean>

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.loading$ = this.store.select(selectMusicFileLoading)
  }

  ngOnInit(): void {
    this.store.dispatch(MusicFileActions.loadMusicFiles({}))

    this.store.select(selectAllMusicFiles).subscribe((musicFiles: MusicFile[]) => {
      this.dataSource.data = musicFiles
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  deleteMusicFile(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this music file?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(MusicFileActions.deleteMusicFile({ id }))
      }
    })
  }

  toggleLike(id: number, event: Event): void {
    event.stopPropagation()
    this.store.dispatch(MusicFileActions.toggleLike({ id }))
  }

  playMusicFile(id: number): void {
    this.store.dispatch(MusicFileActions.getMusicFileUrl({ id }))

    this.store.select(selectMusicFileUrlById(id)).subscribe((url: string | undefined) => {
      if (url) {
        typeof window!=='undefined'? window.open(url, "_blank"):null
      }
    })
  }

  filterByOwner(): void {
    this.store.dispatch(MusicFileActions.loadMusicFiles({ owner: true }))
  }

  filterByFavorites(): void {
    this.store.dispatch(MusicFileActions.loadMusicFiles({ favorites: true }))
  }

  resetFilters(): void {
    this.store.dispatch(MusicFileActions.loadMusicFiles({}))
  }
}

