import { Component } from '@angular/core';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { TotalIncomeExpenseComponent } from './total-income-expense/total-income-expense.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseTrackerComponent, TransactionHistoryComponent, TransactionFormComponent, TotalIncomeExpenseComponent],
  template: '<app-expense-tracker></app-expense-tracker>'
})
export class AppComponent {}
