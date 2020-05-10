import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingsByTagsChartComponent } from './spendings-by-tags-chart.component';

describe('SpendingsByTagsChartComponent', () => {
  let component: SpendingsByTagsChartComponent;
  let fixture: ComponentFixture<SpendingsByTagsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendingsByTagsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingsByTagsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
