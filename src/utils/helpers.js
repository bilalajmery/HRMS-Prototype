import { format, formatDistanceToNow, parseISO, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

// Format date helpers
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '—';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr);
    } catch {
        return '—';
    }
};

export const formatDateTime = (date) => {
    return formatDate(date, 'MMM dd, yyyy h:mm a');
};

export const formatRelativeTime = (date) => {
    if (!date) return '—';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
        return '—';
    }
};

// Calculate days until expiry
export const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    try {
        const dateObj = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
        return differenceInDays(dateObj, new Date());
    } catch {
        return null;
    }
};

// Check if date is expired
export const isExpired = (date) => {
    if (!date) return false;
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isBefore(dateObj, new Date());
    } catch {
        return false;
    }
};

// Check if expiring soon (within 30 days)
export const isExpiringSoon = (date, days = 30) => {
    if (!date) return false;
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        const futureDate = addDays(new Date(), days);
        return isAfter(dateObj, new Date()) && isBefore(dateObj, futureDate);
    } catch {
        return false;
    }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('en-US').format(num);
};

// Format percentage
export const formatPercent = (value, decimals = 1) => {
    if (value === null || value === undefined) return '—';
    return `${value.toFixed(decimals)}%`;
};

// Generate initials from name
export const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Generate random color from name (for avatars)
export const getAvatarColor = (name) => {
    const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-cyan-500',
        'bg-teal-500',
        'bg-green-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-amber-500'
    ];

    if (!name) return colors[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Search/filter helper
export const searchInObject = (obj, searchTerm) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    return Object.values(obj).some((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.toLowerCase().includes(term);
        if (typeof value === 'number') return value.toString().includes(term);
        if (Array.isArray(value)) return value.some((v) => String(v).toLowerCase().includes(term));
        return false;
    });
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Generate unique ID
export const generateId = (prefix = 'ID') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Download as CSV
export const downloadCSV = (data, filename) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map((row) =>
            headers.map((header) => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
};

// Calculate statistics
export const calculateStats = (data, key) => {
    if (!data.length) return { sum: 0, avg: 0, min: 0, max: 0 };

    const values = data.map((item) => item[key]).filter((v) => typeof v === 'number');

    return {
        sum: values.reduce((a, b) => a + b, 0),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
    };
};

// Group by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key] || 'Other';
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

// Count by key
export const countBy = (array, key) => {
    const grouped = groupBy(array, key);
    return Object.entries(grouped).map(([name, items]) => ({
        name,
        count: items.length
    }));
};

// Sort array by key
export const sortBy = (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA === valueB) return 0;
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        const comparison = valueA < valueB ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
    });
};

// Classnames helper (like clsx/classnames)
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
