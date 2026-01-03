import { useFinance } from '../context/FinanceContext';
import { Bell, Download, Upload, Trash2, CheckCircle } from 'lucide-react';
import { formatDateTime } from '../utils/format';
import { useState } from 'react';

export default function Settings() {
  const { notifications, markNotificationAsRead, clearAllNotifications, exportData, importData } = useFinance();
  const [importError, setImportError] = useState<string>('');

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-financeiro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        importData(data);
        setImportError('');
        alert('Dados importados com sucesso!');
      } catch (error) {
        setImportError('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={24} />
          <h2 className="text-xl font-bold">Notificações</h2>
        </div>

        {unreadNotifications.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-red-600 dark:text-red-400">
              Não Lidas ({unreadNotifications.length})
            </h3>
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.type === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : notification.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="ml-4 p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg"
                      title="Marcar como lida"
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {readNotifications.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">
              Lidas ({readNotifications.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {readNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 opacity-75"
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Nenhuma notificação
          </p>
        )}

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="btn-secondary w-full mt-4"
          >
            Limpar Todas as Notificações
          </button>
        )}
      </div>

      {/* Backup & Restore */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Backup e Restauração</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Exporte seus dados para fazer backup ou transferir para outro dispositivo.
            </p>
            <button
              onClick={handleExport}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={20} />
              Exportar Dados
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Importe dados de um backup anterior.
            </p>
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <Upload size={20} />
              Importar Dados
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {importError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">{importError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-300 dark:border-red-700">
        <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
          Zona de Perigo
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Esta ação irá apagar TODOS os seus dados permanentemente. Certifique-se de ter feito um backup antes.
        </p>
        <button
          onClick={handleClearAllData}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 size={20} />
          Limpar Todos os Dados
        </button>
      </div>

      {/* Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold mb-2">Sobre a Aplicação</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Plano Financeiro</strong> é uma aplicação completa para gerenciamento de contas a pagar e receber.
          Todos os dados são armazenados localmente no seu navegador.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Versão 1.0.0
        </p>
      </div>
    </div>
  );
}

