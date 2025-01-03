import { Component, computed, signal } from '@angular/core';
import { Transaction } from '../expense.model';
import { CommonModule } from '@angular/common';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TransactionHistoryComponent {
  transactions = signal<Transaction[]>([]);
  protected Math = Math;

  constructor(private storageService: StorageService) {}
  
  ngOnInit() {
    this.storageService.transactions$.subscribe((transactions) => {
      this.transactions.set(transactions);
    });
  }

  deleteTransaction(id: string) {
    this.transactions.update((transactions) =>
      transactions.filter((t) => t.id !== id)
    );
  }

  sortedTransactions = computed(() => {
    return [...this.transactions()].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  });
}
