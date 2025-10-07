import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBg: 'bg-yellow-100'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${styles.iconBg} mr-3`}>
              <AlertTriangle size={24} className={styles.icon} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {title}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConfirmContextType {
  confirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
  }) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

interface ConfirmProviderProps {
  children: React.ReactNode;
}

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'warning' | 'danger' | 'info';
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
  });

  const confirm = useCallback((options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(true);
    }
    setDialogState(prev => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  const handleCancel = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false);
    }
    setDialogState(prev => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        type={dialogState.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;