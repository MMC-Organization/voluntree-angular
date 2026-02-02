import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolProfile } from './profile';

describe('Profile', () => {
  let component: VolProfile;
  let fixture: ComponentFixture<VolProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
