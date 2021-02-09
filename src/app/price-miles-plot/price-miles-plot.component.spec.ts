import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceMilesPlotComponent } from './price-miles-plot.component';

describe('PriceMilesPlotComponent', () => {
  let component: PriceMilesPlotComponent;
  let fixture: ComponentFixture<PriceMilesPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceMilesPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceMilesPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
