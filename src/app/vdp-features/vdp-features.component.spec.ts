import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdpFeaturesComponent } from './vdp-features.component';

describe('VdpFeaturesComponent', () => {
  let component: VdpFeaturesComponent;
  let fixture: ComponentFixture<VdpFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdpFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdpFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
