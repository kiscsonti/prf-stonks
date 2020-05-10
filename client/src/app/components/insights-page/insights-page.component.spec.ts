import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsPageComponent } from './insights-page.component';

describe('InsightsPageComponent', () => {
  let component: InsightsPageComponent;
  let fixture: ComponentFixture<InsightsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
