import { useState, useMemo } from 'react';
import { HiChevronLeft, HiChevronRight, HiChevronDown } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const Table = ({
    columns,
    data,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    emptyIcon,
    pagination = false,
    pageSize = 10,
    sortable = false,
    className = '',
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const comparison = aValue < bValue ? -1 : 1;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig, sortable]);

    // Pagination logic
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, pagination, currentPage, pageSize]);

    const totalPages = Math.ceil(data.length / pageSize);

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Empty state
    if (!data.length) {
        return (
            <div className={cn('bg-white rounded-xl border border-slate-200 p-12', className)}>
                <div className="flex flex-col items-center justify-center text-center">
                    {emptyIcon && (
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            {emptyIcon}
                        </div>
                    )}
                    <p className="text-slate-500 text-sm">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={cn(
                                        'px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
                                        col.sortable !== false && sortable && 'cursor-pointer hover:bg-slate-100 select-none',
                                        col.className
                                    )}
                                    style={{ width: col.width }}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {sortable && col.sortable !== false && sortConfig.key === col.key && (
                                            <HiChevronDown
                                                className={cn(
                                                    'w-4 h-4 transition-transform',
                                                    sortConfig.direction === 'desc' && 'rotate-180'
                                                )}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={() => onRowClick?.(row)}
                                className={cn(
                                    'hover:bg-slate-50 transition-colors',
                                    onRowClick && 'cursor-pointer'
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cn('px-6 py-4 text-sm text-slate-600', col.cellClassName)}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, data.length)} of {data.length} results
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        'w-9 h-9 text-sm font-medium rounded-lg transition-colors',
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-white'
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
