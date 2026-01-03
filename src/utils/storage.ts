import { Transaction, Category, Notification } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'plano_financeiro_transactions',
  CATEGORIES: 'plano_financeiro_categories',
  NOTIFICATIONS: 'plano_financeiro_notifications',
};

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

export const getCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Erro ao salvar categorias:', error);
  }
};

export const getNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (error) {
    console.error('Erro ao salvar notificações:', error);
  }
};

