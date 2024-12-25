import { Injectable } from '@angular/core';
import { Transaction } from './expense.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'expense_tracker_transactions';

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }

  loadTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored).map((t: any) => ({
      ...t,
      timestamp: new Date(t.timestamp)
    }));
  }

  constructor() { }
}
