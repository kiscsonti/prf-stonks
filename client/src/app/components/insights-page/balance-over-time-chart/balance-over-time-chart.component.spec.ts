import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceOverTimeChartComponent } from './balance-over-time-chart.component';

describe('BalanceOverTimeChartComponent', () => {
  let component: BalanceOverTimeChartComponent;
  let fixture: ComponentFixture<BalanceOverTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceOverTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceOverTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
