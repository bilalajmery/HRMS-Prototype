import { cn } from '../../utils/helpers';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
        warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-sm',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500',
        link: 'text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };

    const sizes = {
        xs: 'px-2.5 py-1.5 text-xs gap-1.5',
        sm: 'px-3 py-2 text-sm gap-2',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-5 py-3 text-base gap-2.5',
        xl: 'px-6 py-3.5 text-base gap-3',
    };

    const iconSizes = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-5 h-5',
    };

    return (
        <button
            type={type}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <svg className={cn('animate-spin', iconSizes[size])} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {!loading && Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
        </button>
    );
};

export default Button;
