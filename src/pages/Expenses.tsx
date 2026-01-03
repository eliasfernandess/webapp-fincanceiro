import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Search } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency } from '../utils/format';

export default function Expenses() {
  const { transactions } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const expenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense');
  }, [transactions]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [expenses, searchTerm, statusFilter, categoryFilter]);

  const totalPending = useMemo(() => {
    return filteredExpenses
      .filter(e => e.status === 'pending' || e.status === 'overdue')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalPaid = useMemo(() => {
    return filteredExpenses
      .filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const { categories } = useFinance();
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Contas a Pagar</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Conta
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300 mb-1">Total Pendente</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalPending)}
          </p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 mb-1">Total Pago</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Contas</p>
          <p className="text-2xl font-bold">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar contas..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Vencida</option>
            </select>
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredExpenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((expense) => (
            <TransactionCard key={expense.id} transaction={expense} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Nenhuma conta encontrada com os filtros aplicados'
              : 'Nenhuma conta a pagar cadastrada'}
          </p>
          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar primeira conta
            </button>
          )}
        </div>
      )}

      {showForm && (
        <TransactionForm
          type="expense"
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

