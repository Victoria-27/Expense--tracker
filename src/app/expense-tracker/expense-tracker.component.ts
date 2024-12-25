import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction, CATEGORIES } from '../expense.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container mx-auto max-w-lg p-4">
    <h1 class="text-2xl font-bold mb-6">Expense Tracker</h1>

    <!-- Balance Section -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold">YOUR BALANCE</h2>
      <div class="text-3xl font-bold">₦{{ balance().toFixed(2) }}</div>
    </div>

    <!-- Income/Expense Summary -->
    <div class="bg-white rounded-lg shadow p-4 mb-6 flex justify-between">
      <div>
        <h3 class="text-lg">INCOME</h3>
        <div class="text-green-600 text-xl">
          +₦{{ totalIncome().toFixed(2) }}
        </div>
      </div>
      <div>
        <h3 class="text-lg">EXPENSE</h3>
        <div class="text-red-600 text-xl">
          -₦{{ totalExpense().toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">History</h2>
      <div class="space-y-2">
        <div *ngIf="transactions().length === 0" class="text-center py-4 text-gray-500">
          No transactions found
        </div>
        <div 
          *ngFor="let transaction of sortedTransactions()"
          class="flex justify-between p-3 bg-white rounded border-r-4 group relative"
          [class.border-green-500]="transaction.type === 'income'"
          [class.border-red-500]="transaction.type === 'expense'"
        >
          <div>
            <div>{{ transaction.text }}</div>
            <div class="text-sm text-gray-500">
              {{ transaction.category }} • {{ transaction.timestamp | date:'medium' }}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span [class.text-green-600]="transaction.type === 'income'"
                  [class.text-red-600]="transaction.type === 'expense'">
              {{ transaction.type === 'income' ? '+' : '-' }}₦{{ Math.abs(transaction.amount).toFixed(2) }}
            </span>
            <button 
              (click)="deleteTransaction(transaction.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Transaction Form -->
    <div>
      <h2 class="text-lg font-semibold mb-3">Add new transaction</h2>
      <form (ngSubmit)="addTransaction()" class="space-y-4" #form="ngForm">
        <div>
          <label class="block mb-1">Text</label>
          <input 
            type="text" 
            [(ngModel)]="newTransactionText"
            name="text"
            required
            minlength="3"
            #text="ngModel"
            class="w-full p-2 border rounded"
            [class.border-red-500]="text.invalid && text.touched"
            placeholder="Enter text..."
          >
          <span *ngIf="text.invalid && text.touched" class="text-red-500 text-sm">
            Description must be at least 3 characters long
          </span>
        </div>

        <div>
          <label class="block mb-1">Type</label>
          <select 
            [(ngModel)]="transactionType"
            name="type"
            required
            class="w-full p-2 border rounded mb-2"
            (change)="updateCategoryOptions()"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Category</label>
          <select 
            [(ngModel)]="selectedCategory"
            name="category"
            required
            class="w-full p-2 border rounded mb-2"
          >
            <option *ngFor="let category of categoryOptions" [value]="category">{{ category }}</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Amount</label>
          <input 
            type="number" 
            [(ngModel)]="newTransactionAmount"
            name="amount"
            required
            min="0.01"
            #amount="ngModel"
            class="w-full p-2 border rounded"
            [class.border-red-500]="amount.invalid && amount.touched"
            placeholder="Enter amount..."
          >
          <span *ngIf="amount.invalid && amount.touched" class="text-red-500 text-sm">
            Amount must be greater than 0
          </span>
        </div>

        <button 
          type="submit"
          [disabled]="form.invalid"
          class="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add transaction
        </button>
      </form>
    </div>
  </div>
`,
  styles: [
    `
      :host {
        display: block;
        background-color: #f5f5f5;
        min-height: 100vh;
        padding: 20px;
      }
    `,
  ],
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

  constructor(private storageService: StorageService) {
    effect(() => {
      this.storageService.saveTransactions(this.transactions());
    });
  }

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

  addTransaction() {
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

    // Reset form
    this.newTransactionText = '';
    this.newTransactionAmount = 0;
    this.transactionType = 'income';
    this.updateCategoryOptions();
  }

  deleteTransaction(id: string) {
    this.transactions.update((transactions) =>
      transactions.filter((t) => t.id !== id)
    );
  }
}