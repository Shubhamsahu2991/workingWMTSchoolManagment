import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginprofileComponent } from './loginprofile.component';

describe('LoginprofileComponent', () => {
  let component: LoginprofileComponent;
  let fixture: ComponentFixture<LoginprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
