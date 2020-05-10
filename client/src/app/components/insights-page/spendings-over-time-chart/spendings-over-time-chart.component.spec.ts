import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingsOverTimeChartComponent } from './spendings-over-time-chart.component';

describe('SpendingsOverTimeChartComponent', () => {
  let component: SpendingsOverTimeChartComponent;
  let fixture: ComponentFixture<SpendingsOverTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendingsOverTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingsOverTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
