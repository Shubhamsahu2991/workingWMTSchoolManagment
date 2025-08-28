import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintbasiclistComponent } from './printbasiclist.component';

describe('PrintbasiclistComponent', () => {
  let component: PrintbasiclistComponent;
  let fixture: ComponentFixture<PrintbasiclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintbasiclistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintbasiclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
