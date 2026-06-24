import { useEffect, useState } from 'react';
import { CheckIcon, XIcon } from './Icons';

export type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  serverFlag?: string;
  serverName?: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function Toast({ type, title, message, serverFlag, serverName, onClose, onAction, actionLabel }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-lg mx-auto">
        <div className={`relative rounded-2xl overflow-hidden border shadow-2xl ${
          type === 'success'
            ? 'bg-gradient-to-br from-green-950/95 to-green-900/95 border-green-500/40 shadow-green-500/30'
            : 'bg-gradient-to-br from-red-950/95 to-red-900/95 border-red-500/40 shadow-red-500/30'
        } backdrop-blur-xl`}>
          {/* Animated background */}
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
            type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`} />

          <div className="relative z-10 p-5 flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {type === 'success' ? (
                <CheckIcon size={28} className="text-green-400" />
              ) : (
                <XIcon size={28} className="text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {serverFlag && <span className="text-xl">{serverFlag}</span>}
                <h3 className={`text-lg font-bold ${type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {title}
                </h3>
              </div>
              {serverName && (
                <p className={`text-sm font-medium mb-1 ${type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                  {serverName}
                </p>
              )}
              <p className={`text-sm ${type === 'success' ? 'text-green-400/80' : 'text-red-400/80'}`}>
                {message}
              </p>
            </div>
            <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-white/40 hover:text-white/80 transition-colors flex-shrink-0">
              <XIcon size={18} />
            </button>
          </div>

          {onAction && (
            <div className="relative z-10 px-5 pb-5">
              <button
                onClick={onAction}
                className={`w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${
                  type === 'success'
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                }`}
              >
                {actionLabel}
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div className="relative z-10 h-0.5 bg-white/5">
            <div className={`h-full transition-all duration-[5000ms] ease-linear ${
              type === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`} style={{ width: visible ? '100%' : '0%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
