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
import  { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import * as PlaylistActions from "../../store/playlist.actions"
import { selectAllPlaylists, selectPlaylistLoading } from "../../store/playlist.selectors"
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component"
import { Playlist } from "../../models/playlist/playlist.model"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-playlist-list",
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
  templateUrl: "./playlist-list.component.html",
  styleUrls: ["./playlist-list.component.scss"],
})
export class PlaylistListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "name", "description", "createdAt", "actions"]
  dataSource = new MatTableDataSource<Playlist>([])
  loading$: Observable<boolean>

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.loading$ = this.store.select(selectPlaylistLoading)
  }

  ngOnInit(): void {
    this.store.dispatch(PlaylistActions.loadPlaylists())

    this.store.select(selectAllPlaylists).subscribe((playlists) => {
      this.dataSource.data = playlists
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

  deletePlaylist(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this playlist?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(PlaylistActions.deletePlaylist({ id }))
      }
    })
  }
}

