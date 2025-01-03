import { Component, computed, signal } from '@angular/core';
import { Transaction } from '../expense.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-total-income-expense',
  templateUrl: './total-income-expense.component.html',
  styleUrls: ['./total-income-expense.component.css'],
  standalone: true,
})
export class TotalIncomeExpenseComponent {
  transactions = signal<Transaction[]>([]);

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

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.storageService.transactions$.subscribe((transactions) => {
      this.transactions.set(transactions);
    });
  }
}
