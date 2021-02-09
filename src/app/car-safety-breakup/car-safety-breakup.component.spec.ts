import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSafetyBreakupComponent } from './car-safety-breakup.component';

describe('CarSafetyBreakupComponent', () => {
  let component: CarSafetyBreakupComponent;
  let fixture: ComponentFixture<CarSafetyBreakupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarSafetyBreakupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarSafetyBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
