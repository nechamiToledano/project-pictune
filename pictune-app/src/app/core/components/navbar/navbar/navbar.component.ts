import { Component, Input, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../auth/models/user.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import * as AuthActions from '../../../../auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, AsyncPipe, MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent {
  @Input() sidenav: any;
  @Input() isHandset$!: Observable<boolean>;
  @Input() user$!: Observable<User | null>;

  private store = inject<Store<AppState>>(Store);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
