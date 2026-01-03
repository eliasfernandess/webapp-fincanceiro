import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { transactions, getSummary, notifications } = useFinance();
  const summary = getSummary();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthExpenses = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.status === 'paid' &&
          t.paymentDate &&
          new Date(t.paymentDate) >= monthStart &&
          new Date(t.paymentDate) <= monthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const monthIncome = transactions
        .filter(t => 
          t.type === 'income' && 
          t.status === 'received' &&
          t.paymentDate &&
          new Date(t.paymentDate) >= monthStart &&
          new Date(t.paymentDate) <= monthEnd
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        despesas: monthExpenses,
        receitas: monthIncome,
        saldo: monthIncome - monthExpenses,
      };
    });
  }, [transactions]);

  const upcomingTransactions = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return transactions
      .filter(t => 
        (t.status === 'pending' || t.status === 'overdue') &&
        new Date(t.dueDate) <= nextWeek
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {unreadNotifications > 0 && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span className="font-semibold">{unreadNotifications} notificações não lidas</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Saldo Total</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.balance)}</p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Total de Despesas</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
              <p className="text-red-100 text-xs mt-1">
                Pendente: {formatCurrency(summary.pendingExpenses)}
              </p>
            </div>
            <TrendingDown size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total de Receitas</p>
              <p className="text-3xl font-bold">{formatCurrency(summary.totalIncome)}</p>
              <p className="text-blue-100 text-xs mt-1">
                Pendente: {formatCurrency(summary.pendingIncome)}
              </p>
            </div>
            <TrendingUp size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Vencidas</p>
              <p className="text-3xl font-bold">
                {formatCurrency(summary.overdueExpenses + summary.overdueIncome)}
              </p>
            </div>
            <AlertTriangle size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Evolução Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="receitas" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="saldo" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Comparativo Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="receitas" fill="#3b82f6" />
              <Bar dataKey="despesas" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Transactions */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} />
          <h2 className="text-xl font-bold">Próximos Vencimentos (7 dias)</h2>
        </div>
        {upcomingTransactions.length > 0 ? (
          <div className="space-y-3">
            {upcomingTransactions.map((transaction) => {
              const dueDate = new Date(transaction.dueDate);
              const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(transaction.dueDate), "dd/MM/yyyy", { locale: ptBR })} - 
                      {daysUntil === 0 ? ' Vence hoje!' : daysUntil === 1 ? ' Vence amanhã' : ` Vence em ${daysUntil} dias`}
                    </p>
                  </div>
                  <p className={`font-bold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Nenhuma transação nos próximos 7 dias
          </p>
        )}
      </div>
    </div>
  );
}

