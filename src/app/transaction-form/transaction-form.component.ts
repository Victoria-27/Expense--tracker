import { Component, signal } from '@angular/core';
import { CATEGORIES, Transaction } from '../expense.model';
import { FormsModule, NgForm } from '@angular/forms';
import { StorageService } from '../storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TransactionFormComponent {
  transactions = signal<Transaction[]>([]);

  newTransactionAmount = 0;
  newTransactionText = '';
  transactionType: 'income' | 'expense' = 'income';
  selectedCategory = CATEGORIES.income[0];
  categoryOptions = CATEGORIES.income;


  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const savedTransactions = this.storageService.loadTransactions();
    this.transactions.set(savedTransactions);
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

  // Save the transaction directly using the service
  const updatedTransactions = [...this.storageService.loadTransactions(), newTransaction];
  this.storageService.saveTransactions(updatedTransactions);
  
    // Reset form
    form.resetForm({
      text: '',
      amount: 0,
      type: 'income',
      category: this.categoryOptions[0],
    });
    this.updateCategoryOptions();
  }

  updateCategoryOptions() {
    this.categoryOptions =
      this.transactionType === 'income'
        ? CATEGORIES.income
        : CATEGORIES.expense;
    this.selectedCategory = this.categoryOptions[0];
  }
}
