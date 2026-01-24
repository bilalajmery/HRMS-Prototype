import { cn } from '../../utils/helpers';

const Card = ({
    children,
    className = '',
    padding = true,
    hover = false,
    onClick,
    ...props
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-slate-200 shadow-sm',
                padding && 'p-6',
                hover && 'hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '', ...props }) => (
    <div className={cn('mb-4', className)} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
    <h3 className={cn('text-lg font-semibold text-slate-800', className)} {...props}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
    <p className={cn('text-sm text-slate-500 mt-1', className)} {...props}>
        {children}
    </p>
);

const CardContent = ({ children, className = '', ...props }) => (
    <div className={cn('', className)} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
    <div className={cn('mt-4 pt-4 border-t border-slate-100 flex items-center gap-3', className)} {...props}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
