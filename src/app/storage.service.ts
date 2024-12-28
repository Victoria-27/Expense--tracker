import { Injectable } from '@angular/core';
import { Transaction } from './expense.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);


  constructor() {
    const storedTransactions = this.loadFromStorage();
    this.transactionsSubject.next(storedTransactions);
  }

  loadTransactions(): Transaction[] {
    return this.loadFromStorage();
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  private loadFromStorage(): Transaction[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) return [];

    try {
      const transactions = JSON.parse(storedData);
      return transactions.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }
}
