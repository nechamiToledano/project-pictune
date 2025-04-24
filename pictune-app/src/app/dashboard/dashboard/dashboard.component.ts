import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, shareReplay } from 'rxjs';
import { selectUser } from '../../auth/store/auth.selectors';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppState } from '../../store/app.state'; // ודא שהנתיב נכון
import { User } from '../../auth/models/user.model';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../core/components/navbar/navbar/navbar.component';
import { SidebarComponent } from '../../core/components/sidebar/sidebar/sidebar.component';
import { MatSidenavModule } from "@angular/material/sidenav"
import { BackgroundComponent } from '../../core/components/background/background/background.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, MatSidenavModule, NavbarComponent, SidebarComponent, BackgroundComponent],
    templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isHandset$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState> // כאן תוודא שאתה מייבא את AppState הנכון
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.user$ = this.store.select(selectUser);
  }
}
