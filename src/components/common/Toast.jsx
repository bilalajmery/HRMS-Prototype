import { createPortal } from 'react-dom';
import { HiCheck, HiX, HiExclamation, HiInformationCircle } from 'react-icons/hi';
import { cn } from '../../utils/helpers';
import useStore from '../../store/useStore';

const Toast = () => {
    const { toasts, removeToast } = useStore();

    const icons = {
        success: HiCheck,
        error: HiX,
        warning: HiExclamation,
        info: HiInformationCircle,
    };

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'bg-green-500 text-white',
            text: 'text-green-800',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: 'bg-red-500 text-white',
            text: 'text-red-800',
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: 'bg-amber-500 text-white',
            text: 'text-amber-800',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'bg-blue-500 text-white',
            text: 'text-blue-800',
        },
    };

    if (!toasts.length) return null;

    return createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((toast) => {
                const Icon = icons[toast.type] || icons.info;
                const style = styles[toast.type] || styles.info;

                return (
                    <div
                        key={toast.id}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up min-w-[300px] max-w-md',
                            style.bg,
                            style.border
                        )}
                    >
                        <div className={cn('p-1.5 rounded-lg', style.icon)}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <p className={cn('flex-1 text-sm font-medium', style.text)}>
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/50 rounded transition-colors"
                        >
                            <HiX className={cn('w-4 h-4', style.text)} />
                        </button>
                    </div>
                );
            })}
        </div>,
        document.body
    );
};

export default Toast;
