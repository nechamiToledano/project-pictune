import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
=======
>>>>>>> 138eb8a247de855a83e6f55e317afa7c79956caa
import { FileListComponent } from "./features/file-management/file-list/file-list.component";
import { UserListComponent } from "./features/user-management/user-list/user-list.component";

@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet, FileListComponent, UserListComponent],
=======
  imports: [ FileListComponent, UserListComponent],
>>>>>>> 138eb8a247de855a83e6f55e317afa7c79956caa
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pictune-admin';
}
