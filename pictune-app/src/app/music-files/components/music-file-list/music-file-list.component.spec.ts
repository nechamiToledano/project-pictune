import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicFileListComponent } from './music-file-list.component';

describe('MusicFileListComponent', () => {
  let component: MusicFileListComponent;
  let fixture: ComponentFixture<MusicFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicFileListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
