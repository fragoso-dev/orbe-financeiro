import { Transaction, TransactionFilters, DashboardSummary } from '@/types/transaction';
import { format, isAfter, isBefore, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// Mock data for demonstration - In production, this would be API calls
let mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    type: 'income',
    category: 'Salário',
    description: 'Salário mensal',
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    amount: -150,
    type: 'expense',
    category: 'Alimentação',
    description: 'Supermercado',
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    amount: -800,
    type: 'expense',
    category: 'Moradia',
    description: 'Aluguel',
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    amount: -200,
    type: 'expense',
    category: 'Transporte',
    description: 'Combustível',
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
  },
];

export const categories = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros Rendimentos',
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Roupas',
  'Tecnologia',
  'Seguros',
  'Impostos',
  'Outros Gastos',
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    await delay(500);
    
    let filtered = [...mockTransactions];
    
    if (filters?.startDate) {
      const startDate = parseISO(filters.startDate);
      filtered = filtered.filter(t => isAfter(parseISO(t.date), startDate) || parseISO(t.date).getTime() === startDate.getTime());
    }
    
    if (filters?.endDate) {
      const endDate = parseISO(filters.endDate);
      filtered = filtered.filter(t => isBefore(parseISO(t.date), endDate) || parseISO(t.date).getTime() === endDate.getTime());
    }
    
    if (filters?.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters?.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    await delay(500);
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    await delay(500);
    
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    mockTransactions[index] = { ...mockTransactions[index], ...updates };
    return mockTransactions[index];
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(500);
    
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    mockTransactions.splice(index, 1);
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    await delay(500);
    
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const monthlyTransactions = mockTransactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
    
    const totalBalance = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = Math.abs(monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
    
    // Group by category
    const categoryGroups = monthlyTransactions.reduce((acc, transaction) => {
      const key = transaction.category;
      if (!acc[key]) {
        acc[key] = { category: key, amount: 0, type: transaction.type };
      }
      acc[key].amount += Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, { category: string; amount: number; type: any }>);
    
    const transactionsByCategory = Object.values(categoryGroups);
    
    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      transactionsByCategory,
    };
  },
};