import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIDcardsComponent } from './student-idcards.component';

describe('StudentIDcardsComponent', () => {
  let component: StudentIDcardsComponent;
  let fixture: ComponentFixture<StudentIDcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentIDcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentIDcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
