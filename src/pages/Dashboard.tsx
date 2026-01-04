import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar, Printer, FileSpreadsheet } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo, useRef } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReactToPrint } from 'react-to-print';
import { exportToExcel } from '../utils/export';

export default function Dashboard() {
  const { transactions, getSummary, notifications, categories } = useFinance();
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });
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

  const handleExportExcel = () => {
    exportToExcel(transactions, categories);
  };

  return (
    <div className="space-y-6" ref={printRef}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {unreadNotifications > 0 && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
              <span className="font-semibold">{unreadNotifications} notificações não lidas</span>
            </div>
          )}
          <button
            onClick={handleExportExcel}
            className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
            title="Exportar para Excel"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2"
            title="Imprimir"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="card-gradient bg-gradient-to-br from-green-500 via-green-600 to-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-50 text-sm font-medium mb-2">Saldo Total</p>
              <p className="text-4xl font-bold mb-1">{formatCurrency(summary.balance)}</p>
              <p className={`text-sm font-medium ${summary.balance >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                {summary.balance >= 0 ? '✓ Positivo' : '⚠ Negativo'}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <DollarSign size={32} className="opacity-90" />
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-red-500 via-red-600 to-rose-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-50 text-sm font-medium mb-2">Total de Despesas</p>
              <p className="text-4xl font-bold mb-1">{formatCurrency(summary.totalExpenses)}</p>
              <p className="text-red-100 text-xs mt-1 font-medium">
                Pendente: {formatCurrency(summary.pendingExpenses)}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <TrendingDown size={32} className="opacity-90" />
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-50 text-sm font-medium mb-2">Total de Receitas</p>
              <p className="text-4xl font-bold mb-1">{formatCurrency(summary.totalIncome)}</p>
              <p className="text-blue-100 text-xs mt-1 font-medium">
                Pendente: {formatCurrency(summary.pendingIncome)}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <TrendingUp size={32} className="opacity-90" />
            </div>
          </div>
        </div>

        <div className="card-gradient bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-50 text-sm font-medium mb-2">Vencidas</p>
              <p className="text-4xl font-bold mb-1">
                {formatCurrency(summary.overdueExpenses + summary.overdueIncome)}
              </p>
              <p className="text-orange-100 text-xs mt-1 font-medium">
                {summary.overdueExpenses + summary.overdueIncome > 0 ? '⚠ Atenção!' : '✓ Sem vencidas'}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <AlertTriangle size={32} className="opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold">Evolução Mensal</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line type="monotone" dataKey="receitas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="saldo" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xl font-bold">Comparativo Mensal</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" radius={[8, 8, 0, 0]} />
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

