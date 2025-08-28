import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeloadComponent } from './welcomeload.component';

describe('WelcomeloadComponent', () => {
  let component: WelcomeloadComponent;
  let fixture: ComponentFixture<WelcomeloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
