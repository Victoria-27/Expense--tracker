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
        
        // Validate and map each transaction
        return transactions.map((t: any) => {
            if (this.isValidTransaction(t)) {
                return {
                    ...t,
                    timestamp: new Date(t.timestamp), // Parse timestamp as Date
                };
            } else {
                console.warn('Invalid transaction found:', t);
                return null; // Optionally filter out invalid items
            }
        }).filter(Boolean); // Remove any null values
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
}

// Helper method to validate transaction shape
private isValidTransaction(t: any): t is Transaction {
    return (
        t &&
        typeof t.id === 'string' &&
        typeof t.text === 'string' &&
        typeof t.amount === 'number' &&
        typeof t.type === 'string' &&
        typeof t.category === 'string' &&
        t.timestamp
    );
}

}
