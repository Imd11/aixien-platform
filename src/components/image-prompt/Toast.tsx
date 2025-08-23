"use client";

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast, Toast as ToastType } from '@/hooks/use-toast';

const ToastComponent = ({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const getIcon = () => {
    if (toast.variant === 'destructive') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getBgColor = () => {
    if (toast.variant === 'destructive') {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className={`flex items-start p-4 rounded-lg border shadow-md ${getBgColor()} max-w-sm`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm text-gray-700 mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};