import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerIntelligenceComponent } from './buyer-intelligence.component';

describe('BuyerIntelligenceComponent', () => {
  let component: BuyerIntelligenceComponent;
  let fixture: ComponentFixture<BuyerIntelligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerIntelligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
