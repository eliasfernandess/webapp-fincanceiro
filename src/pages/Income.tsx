import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Search } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency } from '../utils/format';

export default function Income() {
  const { transactions, categories } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const income = useMemo(() => {
    return transactions.filter(t => t.type === 'income');
  }, [transactions]);

  const filteredIncome = useMemo(() => {
    return income.filter(item => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [income, searchTerm, statusFilter, categoryFilter]);

  const totalPending = useMemo(() => {
    return filteredIncome
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.amount, 0);
  }, [filteredIncome]);

  const totalReceived = useMemo(() => {
    return filteredIncome
      .filter(i => i.status === 'received')
      .reduce((sum, i) => sum + i.amount, 0);
  }, [filteredIncome]);

  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Contas a Receber</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Receita
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="card-gradient bg-gradient-to-br from-yellow-500 to-amber-600">
          <p className="text-yellow-50 text-sm font-medium mb-2">Total Pendente</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(totalPending)}
          </p>
        </div>
        <div className="card-gradient bg-gradient-to-br from-green-500 to-emerald-600">
          <p className="text-green-50 text-sm font-medium mb-2">Total Recebido</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(totalReceived)}
          </p>
        </div>
        <div className="card-gradient bg-gradient-to-br from-blue-500 to-cyan-600">
          <p className="text-blue-50 text-sm font-medium mb-2">Total de Contas</p>
          <p className="text-3xl font-bold text-white">{filteredIncome.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar receitas..."
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
              <option value="received">Recebido</option>
              <option value="overdue">Vencida</option>
            </select>
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {incomeCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredIncome.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncome.map((item) => (
            <TransactionCard key={item.id} transaction={item} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Nenhuma receita encontrada com os filtros aplicados'
              : 'Nenhuma conta a receber cadastrada'}
          </p>
          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar primeira receita
            </button>
          )}
        </div>
      )}

      {showForm && (
        <TransactionForm
          type="income"
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

