'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface IConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
    variant = 'danger', onConfirm, onCancel,
}: IConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
                            variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                            <ExclamationTriangleIcon className={`w-8 h-8 ${
                                variant === 'danger' ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                        <p className="text-gray-500 text-sm mb-6">{message}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors ${
                                    variant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-yellow-500 hover:bg-yellow-600'
                                }`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
