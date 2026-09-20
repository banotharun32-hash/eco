import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgMap = {
    success: 'bg-emerald-900 border-emerald-500 text-emerald-50',
    error: 'bg-rose-900 border-rose-500 text-rose-50',
    info: 'bg-sky-900 border-sky-500 text-sky-50',
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 ${bgMap[toast.type]}`}>
        {iconMap[toast.type]}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
          {toast.message && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
