import { useState, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  type: 'expense' | 'income';
  onClose: () => void;
  onSave: () => void;
}

export default function TransactionForm({ transaction, type, onClose, onSave }: TransactionFormProps) {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: '',
    paymentDate: '',
    category: '',
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        dueDate: transaction.dueDate.split('T')[0],
        paymentDate: transaction.paymentDate?.split('T')[0] || '',
        category: transaction.category,
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const status: TransactionStatus = formData.paymentDate 
      ? (type === 'expense' ? 'paid' : 'received') 
      : 'pending';
    
    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      category: formData.category,
      type,
      status,
      notes: formData.notes || undefined,
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {transaction ? 'Editar' : 'Nova'} {type === 'expense' ? 'Conta a Pagar' : 'Conta a Receber'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Descrição</label>
            <input
              type="text"
              className="input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Data de Vencimento</label>
            <input
              type="date"
              className="input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Data de Pagamento/Recebimento (opcional)</label>
            <input
              type="date"
              className="input"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Observações</label>
            <textarea
              className="input"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" className="btn-primary flex-1">
              {transaction ? 'Atualizar' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

