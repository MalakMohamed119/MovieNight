import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendifyComponent } from './trendify';

describe('TrendifyComponent', () => {
  let component: TrendifyComponent;
  let fixture: ComponentFixture<TrendifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
