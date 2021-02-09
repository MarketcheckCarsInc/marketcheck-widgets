import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCarsComponent } from './similar-cars.component';

describe('SimilarCarsComponent', () => {
  let component: SimilarCarsComponent;
  let fixture: ComponentFixture<SimilarCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimilarCarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
