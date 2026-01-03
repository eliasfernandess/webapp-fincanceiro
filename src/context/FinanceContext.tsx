import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, Notification, FinancialSummary } from '../types';
import { 
  getTransactions, 
  saveTransactions, 
  getCategories, 
  saveCategories,
  getNotifications,
  saveNotifications 
} from '../utils/storage';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  notifications: Notification[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  getSummary: () => FinancialSummary;
  exportData: () => string;
  importData: (data: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Aluguel', color: '#ef4444', icon: 'Home', type: 'expense' },
  { id: '2', name: 'Energia', color: '#f59e0b', icon: 'Zap', type: 'expense' },
  { id: '3', name: 'Água', color: '#3b82f6', icon: 'Droplet', type: 'expense' },
  { id: '4', name: 'Internet', color: '#8b5cf6', icon: 'Wifi', type: 'expense' },
  { id: '5', name: 'Carro', color: '#ec4899', icon: 'Car', type: 'expense' },
  { id: '6', name: 'Alimentação', color: '#10b981', icon: 'Utensils', type: 'expense' },
  { id: '7', name: 'Salário', color: '#10b981', icon: 'DollarSign', type: 'income' },
  { id: '8', name: 'Freelance', color: '#06b6d4', icon: 'Briefcase', type: 'income' },
  { id: '9', name: 'Investimentos', color: '#14b8a6', icon: 'TrendingUp', type: 'income' },
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadedTransactions = getTransactions();
    const loadedCategories = getCategories();
    const loadedNotifications = getNotifications();

    setTransactions(loadedTransactions);
    setCategories(loadedCategories.length > 0 ? loadedCategories : defaultCategories);
    setNotifications(loadedNotifications);

    // Verificar vencimentos e criar notificações
    checkDueDates(loadedTransactions);
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
    checkDueDates(transactions);
  }, [transactions]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const checkDueDates = (transactionsList: Transaction[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newNotifications: Notification[] = [];
    
    transactionsList.forEach(transaction => {
      if (transaction.status === 'pending' || transaction.status === 'overdue') {
        const dueDate = new Date(transaction.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Notificar 3 dias antes
        if (daysUntilDue === 3) {
          const exists = notifications.some(n => 
            n.transactionId === transaction.id && 
            n.message.includes('vence em 3 dias')
          );
          if (!exists) {
            newNotifications.push({
              id: Date.now().toString() + Math.random(),
              transactionId: transaction.id,
              message: `${transaction.description} vence em 3 dias (${transaction.dueDate})`,
              type: 'warning',
              read: false,
              createdAt: new Date().toISOString(),
            });
          }
        }
        
        // Notificar no dia do vencimento
        if (daysUntilDue === 0) {
          const exists = notifications.some(n => 
            n.transactionId === transaction.id && 
            n.message.includes('vence hoje')
          );
          if (!exists) {
            newNotifications.push({
              id: Date.now().toString() + Math.random(),
              transactionId: transaction.id,
              message: `${transaction.description} vence hoje!`,
              type: 'error',
              read: false,
              createdAt: new Date().toISOString(),
            });
          }
        }
        
        // Notificar se vencido
        if (daysUntilDue < 0 && transaction.status !== 'overdue') {
          newNotifications.push({
            id: Date.now().toString() + Math.random(),
            transactionId: transaction.id,
            message: `${transaction.description} está vencida há ${Math.abs(daysUntilDue)} dias!`,
            type: 'error',
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }

    // Atualizar status de vencidas
    setTransactions(prev => prev.map(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0 && t.status === 'pending') {
        return { ...t, status: 'overdue' };
      }
      return t;
    }));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setNotifications(prev => prev.filter(n => n.transactionId !== id));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString() + Math.random(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getSummary = (): FinancialSummary => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary: FinancialSummary = {
      totalExpenses: 0,
      totalIncome: 0,
      balance: 0,
      pendingExpenses: 0,
      pendingIncome: 0,
      overdueExpenses: 0,
      overdueIncome: 0,
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        if (transaction.status === 'paid') {
          summary.totalExpenses += transaction.amount;
        } else {
          summary.pendingExpenses += transaction.amount;
          const dueDate = new Date(transaction.dueDate);
          if (dueDate < today) {
            summary.overdueExpenses += transaction.amount;
          }
        }
      } else {
        if (transaction.status === 'received') {
          summary.totalIncome += transaction.amount;
        } else {
          summary.pendingIncome += transaction.amount;
          const dueDate = new Date(transaction.dueDate);
          if (dueDate < today) {
            summary.overdueIncome += transaction.amount;
          }
        }
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpenses;

    return summary;
  };

  const exportData = (): string => {
    const data = {
      transactions,
      categories,
      notifications,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      if (data.transactions) setTransactions(data.transactions);
      if (data.categories) setCategories(data.categories);
      if (data.notifications) setNotifications(data.notifications);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw new Error('Formato de dados inválido');
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        notifications,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationAsRead,
        clearAllNotifications,
        getSummary,
        exportData,
        importData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

