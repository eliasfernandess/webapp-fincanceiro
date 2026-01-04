import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
}

export default function AlertModal({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info',
  title
}: AlertModalProps) {
  const icons = {
    success: <CheckCircle size={32} className="text-green-500" />,
    error: <XCircle size={32} className="text-red-500" />,
    info: <Info size={32} className="text-blue-500" />,
    warning: <AlertTriangle size={32} className="text-yellow-500" />,
  };

  const titles = {
    success: 'Sucesso!',
    error: 'Erro!',
    info: 'Informação',
    warning: 'Atenção!',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || titles[type]}>
      <div className="flex items-start gap-4">
        {icons[type]}
        <p className="text-gray-700 dark:text-gray-300 flex-1 pt-1">
          {message}
        </p>
      </div>
      <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="btn-primary"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

