import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEconomyComponent } from './fuel-economy.component';

describe('FuelEconomyComponent', () => {
  let component: FuelEconomyComponent;
  let fixture: ComponentFixture<FuelEconomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelEconomyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEconomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
