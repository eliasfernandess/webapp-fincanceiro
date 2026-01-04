import { useFinance } from '../context/FinanceContext';
import { Bell, Download, Upload, Trash2, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { formatDateTime } from '../utils/format';
import { useState } from 'react';
import { ConfirmModal } from '../components/Modal';
import AlertModal from '../components/AlertModal';
import { exportToExcel } from '../utils/export';

export default function Settings() {
  const { notifications, markNotificationAsRead, clearAllNotifications, exportData, importData, transactions, categories } = useFinance();
  const [importError, setImportError] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

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
        setAlertMessage('Dados importados com sucesso!');
        setAlertType('success');
        setShowAlert(true);
      } catch (error) {
        setImportError('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
        setAlertMessage('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
        setAlertType('error');
        setShowAlert(true);
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(transactions, categories);
      setAlertMessage('Planilha Excel exportada com sucesso!');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Erro ao exportar para Excel.');
      setAlertType('error');
      setShowAlert(true);
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
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={20} />
                Exportar JSON
              </button>
              <button
                onClick={handleExportExcel}
                className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet size={20} />
                Exportar Excel
              </button>
            </div>
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
          onClick={() => setShowClearModal(true)}
          className="btn-danger flex items-center gap-2"
        >
          <Trash2 size={20} />
          Limpar Todos os Dados
        </button>
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAllData}
        title="Limpar Todos os Dados"
        message="Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!"
        confirmText="Sim, Limpar Tudo"
        type="danger"
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
        type={alertType}
      />

      {/* Database Info */}
      <div className="card bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span>💾</span>
          Armazenamento de Dados
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Atualmente, seus dados estão sendo salvos <strong>localmente no navegador</strong> (localStorage).
        </p>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">✓ Vantagens:</p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 list-disc">
            <li>Dados privados e seguros</li>
            <li>Funciona offline</li>
            <li>Rápido e responsivo</li>
          </ul>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">⚠ Limitações:</p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 list-disc">
            <li>Dados específicos do navegador/dispositivo</li>
            <li>Não sincroniza entre dispositivos</li>
          </ul>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
          💡 <strong>Dica:</strong> Para sincronização na nuvem, consulte o arquivo <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GUIA_SUPABASE.md</code>
        </p>
      </div>

      {/* Info */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold mb-2">Sobre a Aplicação</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          <strong>Plano Financeiro</strong> é uma aplicação completa e moderna para gerenciamento de contas a pagar e receber.
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Versão 2.0.0
          </p>
          <div className="flex gap-2">
            <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">React</span>
            <span className="badge bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">TypeScript</span>
            <span className="badge bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  );
}

