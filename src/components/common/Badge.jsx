import { cn } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({
    children,
    variant = 'default',
    size = 'sm',
    dot = true,
    className = '',
    ...props
}) => {
    // Get color scheme from STATUS_COLORS or use custom variant
    const colorScheme = STATUS_COLORS[children] || STATUS_COLORS[variant] || STATUS_COLORS.default;

    const sizes = {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-sm',
    };

    const dotSizes = {
        xs: 'w-1 h-1',
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-medium',
                colorScheme.bg,
                colorScheme.text,
                sizes[size],
                className
            )}
            {...props}
        >
            {dot && (
                <span className={cn('rounded-full', colorScheme.dot, dotSizes[size])} />
            )}
            {children}
        </span>
    );
};

export default Badge;
