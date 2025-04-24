import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayylistFormComponent } from './playlist-form.component';

describe('PlayylistFormComponent', () => {
  let component: PlayylistFormComponent;
  let fixture: ComponentFixture<PlayylistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayylistFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayylistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
