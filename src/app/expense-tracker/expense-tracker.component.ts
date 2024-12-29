import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Transaction, CATEGORIES } from '../expense.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.css'],
})
export class ExpenseTrackerComponent implements OnInit {
  transactions = signal<Transaction[]>([]);

  // Form fields
  newTransactionText = '';
  newTransactionAmount = 0;
  transactionType: 'income' | 'expense' = 'income';
  selectedCategory = CATEGORIES.income[0];
  categoryOptions = CATEGORIES.income;

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

  sortedTransactions = computed(() => {
    return [...this.transactions()].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  });

  protected Math = Math;


  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const savedTransactions = this.storageService.loadTransactions();
    this.transactions.set(savedTransactions);
  }

  updateCategoryOptions() {
    this.categoryOptions =
      this.transactionType === 'income'
        ? CATEGORIES.income
        : CATEGORIES.expense;
    this.selectedCategory = this.categoryOptions[0];
  }

  addTransaction(form: NgForm) {
    if (this.newTransactionAmount <= 0) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      text: this.newTransactionText,
      amount: this.newTransactionAmount,
      type: this.transactionType,
      category: this.selectedCategory,
      timestamp: new Date(),
    };

    this.transactions.update((transactions) => [
      ...transactions,
      newTransaction,
    ]);

   // Save to storage
   this.storageService.saveTransactions(this.transactions());

   // Reset form
   form.resetForm({
     text: '',
     amount: 0,
     type: 'income',
     category: this.categoryOptions[0],
   });
   this.updateCategoryOptions();
  }

  deleteTransaction(id: string) {
    this.transactions.update((transactions) =>
      transactions.filter((t) => t.id !== id)
    );
  }
}
