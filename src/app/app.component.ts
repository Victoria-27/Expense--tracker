import { Component } from '@angular/core';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseTrackerComponent, FormsModule],
  template: '<app-expense-tracker></app-expense-tracker>'
})
export class AppComponent {
  title = 'expense';
}
