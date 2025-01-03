import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalIncomeExpenseComponent } from './total-income-expense.component';

describe('TotalIncomeExpenseComponent', () => {
  let component: TotalIncomeExpenseComponent;
  let fixture: ComponentFixture<TotalIncomeExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalIncomeExpenseComponent]
    });
    fixture = TestBed.createComponent(TotalIncomeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
