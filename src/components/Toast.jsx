import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { registerToastFn, resolveConfirm } from './useToast';

const TOAST_DURATION = 3000;

let toastIdCounter = 0;

const variantConfig = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    progressClass: 'bg-green-500',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    progressClass: 'bg-red-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    progressClass: 'bg-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-800',
    progressClass: 'bg-amber-500',
  },
};

function ToastItem({ id, message, variant = 'info', duration, onRemove }) {
  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setVisible(true);
    startTimeRef.current = Date.now();

    if (duration && duration > 0) {
      const tick = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining > 0) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onRemove(id), 200);
      }, duration);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(rafRef.current);
      };
    }
  }, [id, duration, onRemove]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 200);
  };

  return (
    <div
      className={`
        relative w-80 overflow-hidden rounded-xl border shadow-lg
        transition-all duration-200 ease-out
        ${config.bgClass}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div className="flex items-start gap-3 p-3 pr-8">
        <Icon size={18} className={`${config.iconClass} shrink-0 mt-0.5`} />
        <p className={`text-sm leading-snug font-medium ${config.textClass}`}>
          {message}
        </p>
        <button
          type="button"
          onClick={handleClose}
          className={`absolute top-2.5 right-2.5 p-1 rounded-md transition-colors hover:bg-black/5 ${config.textClass}`}
        >
          <X size={14} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div
          className={`h-full transition-all duration-100 ${config.progressClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ConfirmDialog({ message, confirmText, cancelText, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => onConfirm(true), 200);
  };

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => onCancel(false), 200);
  };

  return (
    <div
      className={`
        fixed inset-0 z-[200] flex items-center justify-center
        transition-all duration-200
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-96 p-6
          transition-all duration-200
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">
              {message}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              此操作不可撤销。
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const addToast = useCallback((message, options) => {
    if (options.isConfirm) {
      setConfirmDialog({
        message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
      });
      return;
    }
    const id = ++toastIdCounter;
    const duration = options.duration ?? TOAST_DURATION;
    setToasts((prev) => [...prev, { id, message, variant: options.variant, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    registerToastFn(addToast);
  }, [addToast]);

  const handleConfirm = () => {
    resolveConfirm(true);
    setConfirmDialog(null);
  };

  const handleConfirmCancel = () => {
    resolveConfirm(false);
    setConfirmDialog(null);
  };

  return (
    <>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5">
          {toasts.map((t) => (
            <ToastItem
              key={t.id}
              {...t}
              onRemove={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleConfirmCancel}
        />
      )}
    </>
  );
}
