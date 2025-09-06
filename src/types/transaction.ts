export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: TransactionType;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactionsByCategory: {
    category: string;
    amount: number;
    type: TransactionType;
  }[];
}