import { Component, type OnInit, ViewChild, AfterViewInit, DestroyRef, inject } from "@angular/core"
import { AsyncPipe } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import {  MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import  { Store } from "@ngrx/store"
import { tap, type Observable } from "rxjs"
import type { User } from "../../models/user.model"
import * as UserActions from "../../store/user.actions"
import { selectAllUsers, selectUserLoading } from "../../store/user.selectors"
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component"
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatTooltipModule } from "@angular/material/tooltip"
import { AppState } from "../../../store/app.state"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
   
    AsyncPipe,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,

  ],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "userName", "email", "actions"]
  dataSource = new MatTableDataSource<User>([])
  loading$: Observable<boolean>
  private destroyRef = inject(DestroyRef)
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    this.loading$ = this.store.select(selectUserLoading)
  }

  ngOnInit(): void {
    
    this.store.dispatch(UserActions.loadUsers())

    this.store.select(selectAllUsers).pipe(

      takeUntilDestroyed(this.destroyRef)
    ).subscribe((users: User[]) => {
      this.dataSource.data = users
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

  deleteUser(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this user? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(UserActions.deleteUser({ id }))
      }
    })
  }
  getUserInitials(userName: string): string {
    if (!userName) return ""
    return userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }
}

