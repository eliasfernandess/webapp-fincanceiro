import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Transaction, Category, Notification, FinancialSummary } from '../types';
import { 
  getTransactions, 
  saveTransactions, 
  getCategories, 
  saveCategories,
  getNotifications,
  saveNotifications 
} from '../utils/storage';
import { useDatabase } from '../services/database';
import { isSupabaseEnabled } from '../config/supabase';

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
  const isInitialMount = useRef(true);
  const db = useDatabase();

  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Carregando dados...', { isSupabaseEnabled });
      
      // Carregar do Supabase se disponível, senão do localStorage
      const loadedTransactions = isSupabaseEnabled 
        ? await db.getTransactions()
        : getTransactions();
      const loadedCategories = isSupabaseEnabled
        ? await db.getCategories()
        : getCategories();
      const loadedNotifications = getNotifications();
      
      console.log('📊 Dados carregados:', {
        transactions: loadedTransactions.length,
        categories: loadedCategories.length,
        source: isSupabaseEnabled ? 'Supabase' : 'localStorage'
      });

      // Processar transações para atualizar status de vencidas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const processedTransactions = loadedTransactions.map(t => {
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue < 0 && t.status === 'pending') {
          return { ...t, status: 'overdue' as const };
        }
        return t;
      });

      setTransactions(processedTransactions);
      setCategories(loadedCategories.length > 0 ? loadedCategories : defaultCategories);
      setNotifications(loadedNotifications);

      isInitialMount.current = false;
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      // Salvar no Supabase se disponível, senão no localStorage
      if (isSupabaseEnabled) {
        transactions.forEach(transaction => {
          db.saveTransaction(transaction).catch(console.error);
        });
      } else {
        saveTransactions(transactions);
      }
    }
  }, [transactions]);

  useEffect(() => {
    if (!isInitialMount.current) {
      // Salvar no Supabase se disponível, senão no localStorage
      if (isSupabaseEnabled) {
        categories.forEach(category => {
          db.saveCategory(category).catch(console.error);
        });
      } else {
        saveCategories(categories);
      }
    }
  }, [categories]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Verificar vencimentos periodicamente (sem causar loops)
  useEffect(() => {
    if (transactions.length === 0) return;

    const interval = setInterval(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setTransactions(prev => {
        let hasChanges = false;
        const updated = prev.map(t => {
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilDue < 0 && t.status === 'pending') {
            hasChanges = true;
            return { ...t, status: 'overdue' as const };
          }
          return t;
        });
        // Só retorna novo array se houver mudanças
        return hasChanges ? updated : prev;
      });
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, [transactions.length]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    // Salvar no Supabase imediatamente se disponível
    if (isSupabaseEnabled) {
      db.saveTransaction(newTransaction).catch(console.error);
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => {
      const updated = prev.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );
      // Salvar no Supabase imediatamente se disponível
      if (isSupabaseEnabled) {
        const transaction = updated.find(t => t.id === id);
        if (transaction) {
          db.saveTransaction(transaction).catch(console.error);
        }
      }
      return updated;
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setNotifications(prev => prev.filter(n => n.transactionId !== id));
    
    // Deletar no Supabase se disponível
    if (isSupabaseEnabled) {
      db.deleteTransaction(id).catch(console.error);
    }
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString() + Math.random(),
    };
    setCategories(prev => [...prev, newCategory]);
    
    // Salvar no Supabase imediatamente se disponível
    if (isSupabaseEnabled) {
      db.saveCategory(newCategory).catch(console.error);
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      // Salvar no Supabase imediatamente se disponível
      if (isSupabaseEnabled) {
        const category = updated.find(c => c.id === id);
        if (category) {
          db.saveCategory(category).catch(console.error);
        }
      }
      return updated;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    
    // Deletar no Supabase se disponível
    if (isSupabaseEnabled) {
      db.deleteCategory(id).catch(console.error);
    }
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

