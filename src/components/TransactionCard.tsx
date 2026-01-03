import { Transaction } from '../types';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, isOverdue, getDaysUntilDue } from '../utils/format';
import { STATUS_COLORS } from '../utils/constants';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from './TransactionForm';

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const { categories, updateTransaction, deleteTransaction } = useFinance();
  const [showEditForm, setShowEditForm] = useState(false);
  const category = categories.find(c => c.id === transaction.category);

  const handleToggleStatus = () => {
    const newStatus = transaction.status === 'paid' || transaction.status === 'received'
      ? 'pending'
      : transaction.type === 'expense' ? 'paid' : 'received';
    updateTransaction(transaction.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(transaction.id);
    }
  };

  const daysUntilDue = getDaysUntilDue(transaction.dueDate);
  const overdue = isOverdue(transaction.dueDate) && transaction.status === 'pending';

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{transaction.description}</h3>
            {category && (
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.name}
                </span>
              </div>
            )}
          </div>
          <div className={`text-2xl font-bold ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Vencimento:</span>
            <span className={overdue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
              {formatDate(transaction.dueDate)}
            </span>
          </div>
          {transaction.paymentDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {transaction.type === 'expense' ? 'Pago em:' : 'Recebido em:'}
              </span>
              <span>{formatDate(transaction.paymentDate)}</span>
            </div>
          )}
          {transaction.status === 'pending' && !overdue && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {daysUntilDue === 0
                ? 'Vence hoje!'
                : daysUntilDue === 1
                ? 'Vence amanhã'
                : `Vence em ${daysUntilDue} dias`}
            </div>
          )}
          {overdue && (
            <div className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Vencida há {Math.abs(daysUntilDue)} dias!
            </div>
          )}
        </div>

        {transaction.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
            {transaction.notes}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[transaction.status]}`}>
            {transaction.status === 'paid' && 'Pago'}
            {transaction.status === 'received' && 'Recebido'}
            {transaction.status === 'pending' && 'Pendente'}
            {transaction.status === 'overdue' && 'Vencida'}
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleToggleStatus}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={transaction.status === 'paid' || transaction.status === 'received' ? 'Marcar como pendente' : 'Marcar como pago/recebido'}
            >
              {transaction.status === 'paid' || transaction.status === 'received' ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
            </button>
            <button
              onClick={() => setShowEditForm(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors text-red-600 dark:text-red-400"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {showEditForm && (
        <TransactionForm
          transaction={transaction}
          type={transaction.type}
          onClose={() => setShowEditForm(false)}
          onSave={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}

