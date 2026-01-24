import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineReceiptTax,
    HiOutlinePlus,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineDownload,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineSearch
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Schema
const expenseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    category: z.string().min(1, 'Category is required'),
    date: z.string().min(1, 'Date is required'),
    employeeId: z.string().min(1, 'Employee is required'),
    description: z.string().optional(),
});

const Expenses = () => {
    const { expenses, employees, addExpense, updateExpenseStatus, deleteExpense } = useStore();
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedExpense, setSelectedExpense] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            title: '',
            amount: 0,
            category: 'Travel',
            date: new Date().toISOString().split('T')[0],
            employeeId: '',
            description: '',
        },
    });

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const matchesSearch = (exp.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (exp.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || exp.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [expenses, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        pending: expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0),
        approved: expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0),
        rejected: expenses.filter(e => e.status === 'Rejected').length,
    }), [expenses]);

    const handleOpenDrawer = (mode, expense = null) => {
        setDrawerMode(mode);
        setSelectedExpense(expense);

        if (mode === 'add') {
            reset({ title: '', amount: 0, category: 'Travel', date: new Date().toISOString().split('T')[0], employeeId: '', description: '' });
        } else if (expense) {
            reset({ ...expense });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const employee = employees.find(e => e.id === data.employeeId);

        // Only 'add' logic since edit might be restricted for financial records, but keeping it simple
        if (drawerMode === 'add') {
            addExpense({
                ...data,
                employeeName: employee?.name || 'Unknown',
                status: 'Pending',
            });
            setDrawerOpen(false);
        }
    };

    const updateStatus = (id, status) => {
        updateExpenseStatus(id, status);
    };

    const handleDelete = () => {
        if (selectedExpense && window.confirm('Delete this expense request?')) {
            deleteExpense(selectedExpense.id);
            setDrawerOpen(false);
        }
    };

    const columns = [
        { key: 'title', header: 'Expense', render: (t) => <span className="font-medium text-slate-900">{t}</span> },
        { key: 'employeeName', header: 'Employee' },
        { key: 'amount', header: 'Amount', render: (amt) => <span className="font-bold">{formatCurrency(amt)}</span> },
        { key: 'category', header: 'Category' },
        { key: 'date', header: 'Date', render: (d) => formatDate(d) },
        { key: 'status', header: 'Status', render: (status) => <Badge variant={status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'}>{status}</Badge> },
        {
            key: 'actions',
            header: '',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Button size="xs" variant="ghost" onClick={() => handleOpenDrawer('view', row)}><HiOutlineEye className="w-4 h-4" /></Button>
                    {row.status === 'Pending' && (
                        <>
                            <button onClick={() => updateStatus(row.id, 'Approved')} className="p-1 text-green-600 hover:bg-green-50 rounded"><HiOutlineCheck className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(row.id, 'Rejected')} className="p-1 text-red-600 hover:bg-red-50 rounded"><HiOutlineX className="w-4 h-4" /></button>
                        </>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Expense Claims</h1>
                    <p className="text-slate-500 mt-1">Review and approve employee reimbursement requests</p>
                </div>
                <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>New Claim</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-amber-500">
                    <p className="text-slate-500 text-sm">Pending Approval</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.pending)}</p>
                </Card>
                <Card className="p-4 border-l-4 border-green-500">
                    <p className="text-slate-500 text-sm">Approved (MTD)</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.approved)}</p>
                </Card>
                <Card className="p-4 border-l-4 border-red-500">
                    <p className="text-slate-500 text-sm">Rejected (Count)</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.rejected}</p>
                </Card>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1 w-full lg:max-w-md">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or employee..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <Table columns={columns} data={filteredExpenses} pagination pageSize={10} />

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Submit Claim' : 'Expense Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        selectedExpense?.status === 'Pending' ? (
                            <div className="flex gap-2 w-full">
                                <Button className="flex-1" variant="danger" onClick={() => { updateStatus(selectedExpense.id, 'Rejected'); setDrawerOpen(false); }}>Reject</Button>
                                <Button className="flex-1" variant="success" onClick={() => { updateStatus(selectedExpense.id, 'Approved'); setDrawerOpen(false); }}>Approve</Button>
                            </div>
                        ) : (
                            <Button variant="secondary" className="w-full" onClick={() => setDrawerOpen(false)}>Close</Button>
                        )
                    ) : (
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)}>Submit Claim</Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedExpense ? (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedExpense.title}</h3>
                                <p className="text-slate-500 text-sm mt-1">{selectedExpense.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedExpense.amount)}</p>
                                <Badge className="mt-2">{selectedExpense.status}</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Employee</label>
                                <p className="font-medium">{selectedExpense.employeeName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Date</label>
                                <p className="font-medium">{formatDate(selectedExpense.date)}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold">Description</label>
                            <p className="mt-2 text-slate-700 leading-relaxed bg-white p-3 border border-slate-200 rounded-lg">
                                {selectedExpense.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Attachments</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                <HiOutlineReceiptTax className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">receipt_001.pdf</span>
                                <HiOutlineDownload className="w-4 h-4 text-slate-400 ml-auto" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Claim Title <span className="text-red-500">*</span></label>
                            <Controller name="title" control={control} render={({ field }) => (
                                <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Client Dinner" />
                            )} />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount <span className="text-red-500">*</span></label>
                                <Controller name="amount" control={control} render={({ field }) => (
                                    <input {...field} type="number" step="0.01" onChange={e => field.onChange(parseFloat(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )} />
                                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date <span className="text-red-500">*</span></label>
                                <Controller name="date" control={control} render={({ field }) => (
                                    <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
                                <Controller name="category" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="Travel">Travel</option>
                                        <option value="Meals">Meals</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="Software">Software</option>
                                        <option value="Other">Other</option>
                                    </select>
                                )} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Employee <span className="text-red-500">*</span></label>
                                <Controller name="employeeId" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="">Select Employee</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                )} />
                                {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <Controller name="description" control={control} render={({ field }) => (
                                <textarea {...field} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                            )} />
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer">
                            <p className="text-sm font-medium text-slate-600">Drag & Drop Receipt Here</p>
                            <p className="text-xs text-slate-400 mt-1">or click to browse</p>
                        </div>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Expenses;
