import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadUsers } from '../../../store/user/user.actions';
import { User } from '../../../store/user/user.model';
import { UserState } from '../../../store/user/user.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private store: Store<{ user: UserState }>) {
    this.users$ = this.store.select(state => state.user.users);
  }

  ngOnInit() {
    this.store.dispatch(loadUsers());
  }
}