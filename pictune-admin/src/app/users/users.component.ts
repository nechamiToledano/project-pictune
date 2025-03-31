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
import type { User } from "../store/user.model"
import * as UserActions from "../store/user.actions"
import { UserFormComponent } from "./user-form/user-form.component"

@Component({
  selector: "app-users",
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
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnInit {
  private readonly store = inject(Store<AppState>)
  private readonly dialog = inject(MatDialog)
  private readonly snackBar = inject(MatSnackBar)

  displayedColumns: string[] = ["name", "email", "role", "actions"]
  dataSource = new MatTableDataSource<User>([])
  loading = false
  users$: Observable<User[]>
  error$: Observable<string | null>

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor() {
    this.users$ = this.store.select((state) => state.users.users)
    this.error$ = this.store.select((state) => state.users.error)
  }

  ngOnInit() {
    this.loadUsers()

    this.users$.subscribe((users) => {
      this.dataSource.data = users
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

  loadUsers() {
    this.loading = true
    this.store.dispatch(UserActions.loadUsers())
    setTimeout(() => (this.loading = false), 1000) // Simulate loading time
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  openUserForm(user?: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: "500px",
      data: user || {},
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers()
      }
    })
  }

  deleteUser(userId: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.store.dispatch(UserActions.deleteUser({ userId }))
    }
  }
}

