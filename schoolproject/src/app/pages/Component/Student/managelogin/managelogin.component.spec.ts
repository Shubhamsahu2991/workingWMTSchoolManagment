import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageloginComponent } from './managelogin.component';

describe('ManageloginComponent', () => {
  let component: ManageloginComponent;
  let fixture: ComponentFixture<ManageloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
