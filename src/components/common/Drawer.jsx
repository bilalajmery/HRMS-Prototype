import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiX } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const Drawer = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    position = 'right',
    size = 'md',
    showClose = true,
    closeOnOverlay = true,
    footer,
    className = '',
}) => {
    const drawerRef = useRef(null);

    const sizes = {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[32rem]',
        xl: 'w-[40rem]',
        full: 'w-full max-w-3xl',
    };

    const positions = {
        right: {
            container: 'right-0 inset-y-0',
            transform: 'translate-x-full',
            animation: 'animate-slide-in-right',
        },
        left: {
            container: 'left-0 inset-y-0',
            transform: '-translate-x-full',
            animation: 'animate-slide-in-left',
        },
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

    // Prevent body scroll when drawer is open
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

    const positionStyles = positions[position];

    return createPortal(
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={cn(
                    'absolute flex flex-col bg-white shadow-2xl',
                    positionStyles.container,
                    positionStyles.animation,
                    sizes[size],
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 shrink-0">
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Drawer;
