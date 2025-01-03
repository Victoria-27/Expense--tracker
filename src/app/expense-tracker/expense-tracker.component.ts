import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Transaction, CATEGORIES } from '../expense.model';
import { StorageService } from '../storage.service';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TotalIncomeExpenseComponent } from '../total-income-expense/total-income-expense.component';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TransactionHistoryComponent,
    TransactionFormComponent,
    TotalIncomeExpenseComponent,
  ],
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.css'],
})
export class ExpenseTrackerComponent {
  transactions = signal<Transaction[]>([]);

  // Computed values using signals
  totalIncome = computed(() =>
    this.transactions().reduce(
      (acc, curr) => (curr.type === 'income' ? acc + curr.amount : acc),
      0
    )
  );

  totalExpense = computed(() =>
    this.transactions().reduce(
      (acc, curr) => (curr.type === 'expense' ? acc + curr.amount : acc),
      0
    )
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());
  
  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const savedTransactions = this.storageService.loadTransactions();
    this.transactions.set(savedTransactions);
  }
}
