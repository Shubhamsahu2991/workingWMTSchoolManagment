import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmissionletterComponent } from './addmissionletter.component';

describe('AddmissionletterComponent', () => {
  let component: AddmissionletterComponent;
  let fixture: ComponentFixture<AddmissionletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmissionletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmissionletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
