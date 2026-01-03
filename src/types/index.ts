export type TransactionType = 'expense' | 'income';

export type TransactionStatus = 'pending' | 'paid' | 'received' | 'overdue';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  transactionId: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  read: boolean;
  createdAt: string;
}

export interface FinancialSummary {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  pendingExpenses: number;
  pendingIncome: number;
  overdueExpenses: number;
  overdueIncome: number;
}

