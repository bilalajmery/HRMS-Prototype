import { cn, getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({
    src,
    name,
    size = 'md',
    className = '',
    ...props
}) => {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
        '2xl': 'w-20 h-20 text-xl',
        '3xl': 'w-24 h-24 text-2xl',
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={cn(
                    'rounded-full object-cover',
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center font-semibold text-white',
                sizes[size],
                getAvatarColor(name),
                className
            )}
            {...props}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
