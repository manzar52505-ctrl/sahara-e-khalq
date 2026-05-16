import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string | null;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className={`fixed bottom-8 right-8 z-[100] ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4`}
        >
          <Icon className="w-6 h-6" />
          <span className="font-bold">{message}</span>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
