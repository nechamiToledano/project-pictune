import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicFileFormComponent } from './music-file-form.component';

describe('MusicFileFormComponent', () => {
  let component: MusicFileFormComponent;
  let fixture: ComponentFixture<MusicFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicFileFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
