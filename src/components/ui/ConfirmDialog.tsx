import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">{title}</h2>
            </div>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
