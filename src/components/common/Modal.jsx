import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiX } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showClose = true,
    closeOnOverlay = true,
    footer,
    className = '',
}) => {
    const modalRef = useRef(null);

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full bg-white rounded-2xl shadow-2xl animate-slide-up',
                    sizes[size],
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-start justify-between p-6 border-b border-slate-100">
                        <div>
                            {title && (
                                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-slate-500">{description}</p>
                            )}
                        </div>
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
