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
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Purple for success, Red for error
  const gradientClass = type === 'success'
    ? 'bg-gradient-to-r from-purple-700/95 to-violet-700/95 border-purple-400/50 shadow-purple-500/40'
    : 'bg-gradient-to-r from-red-900/95 to-red-800/95 border-red-500/50 shadow-red-500/40';

  return (
    <div className={`fixed top-3 left-0 right-0 z-50 px-4 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-md mx-auto">
        <div className={`relative rounded-2xl overflow-hidden border shadow-lg backdrop-blur-xl ${gradientClass}`}>
          <div className="relative z-10 flex items-center gap-3 p-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              type === 'success' ? 'bg-white/15' : 'bg-red-500/20'
            }`}>
              {type === 'success' ? (
                <CheckIcon size={22} className="text-white" />
              ) : (
                <XIcon size={22} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {serverFlag && <span className="text-lg">{serverFlag}</span>}
                <h3 className="text-white font-bold text-sm leading-tight truncate">{title}</h3>
              </div>
              {serverName && <p className="text-white/70 text-xs truncate">{serverName}</p>}
              <p className="text-white/60 text-xs truncate">{message}</p>
            </div>
            {onAction && actionLabel && (
              <button
                onClick={onAction}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all active:scale-95 ${
                  type === 'success'
                    ? 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                {actionLabel}
              </button>
            )}
            <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
              <XIcon size={16} />
            </button>
          </div>
          <div className={`h-0.5 ${type === 'success' ? 'bg-white/20' : 'bg-red-400/40'}`}>
            <div className={`h-full transition-all duration-[4000ms] ease-linear ${
              type === 'success' ? 'bg-white/70' : 'bg-red-300'
            }`} style={{ width: visible ? '100%' : '0%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
