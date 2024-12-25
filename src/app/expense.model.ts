export interface Transaction {
    id: string;
    text: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    timestamp: Date;
  }

  export const CATEGORIES = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Bills', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Other']
  };