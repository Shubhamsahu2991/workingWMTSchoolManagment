import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesWithSubjectComponent } from './classes-with-subject.component';

describe('ClassesWithSubjectComponent', () => {
  let component: ClassesWithSubjectComponent;
  let fixture: ComponentFixture<ClassesWithSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesWithSubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesWithSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
