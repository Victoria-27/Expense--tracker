import { Component } from '@angular/core';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseTrackerComponent],
  template: '<app-expense-tracker></app-expense-tracker>'
})
export class AppComponent {}
