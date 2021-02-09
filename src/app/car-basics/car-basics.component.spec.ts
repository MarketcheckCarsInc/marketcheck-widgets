import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBasicsComponent } from './car-basics.component';

describe('CarBasicsComponent', () => {
  let component: CarBasicsComponent;
  let fixture: ComponentFixture<CarBasicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarBasicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
