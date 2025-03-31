import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { deleteFile, loadFiles } from '../../../store/file/file.actions';
import { AsyncPipe } from '@angular/common';
import { File } from '../../../store/file/file.model';


@Component({
  selector: 'app-file-list',
  standalone: true,
  imports:[AsyncPipe],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
})
export class FileListComponent implements OnInit {
  files$: Observable<File[]>;

  constructor(private store: Store<{ file: { files: File[] } }>) {
    this.files$ = this.store.select(state => state.file.files);
  }

  ngOnInit() {
    this.store.dispatch(loadFiles());
  }
  onDeleteFile(fileId: string) {
    this.store.dispatch(deleteFile({ fileId }));
  }
  
}
