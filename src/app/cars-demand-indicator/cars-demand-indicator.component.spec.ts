import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsDemandIndicatorComponent } from './cars-demand-indicator.component';

describe('CarsDemandIndicatorComponent', () => {
  let component: CarsDemandIndicatorComponent;
  let fixture: ComponentFixture<CarsDemandIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsDemandIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsDemandIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
