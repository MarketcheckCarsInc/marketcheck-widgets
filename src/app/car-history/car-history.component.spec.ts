import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';

import { CarHistoryComponent } from './car-history.component';

describe('CarHistoryComponent', () => {
  let component: CarHistoryComponent;
  let fixture: ComponentFixture<CarHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
