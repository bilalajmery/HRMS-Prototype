import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineCalendar,
    HiOutlinePlus,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineDownload,
    HiOutlineClock
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Drawer from '../../components/common/Drawer';
import useStore from '../../store/useStore';
import { formatDate, downloadCSV } from '../../utils/helpers';
import { LEAVE_TYPES } from '../../utils/constants';

// Form Schema
const leaveSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    type: z.string().min(1, 'Leave type is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Reason is required'),
});

const Leave = () => {
    const { leaveRequests, employees, approveLeave, rejectLeave, addLeaveRequest, addToast } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            employeeId: '',
            type: LEAVE_TYPES[0],
            startDate: '',
            endDate: '',
            reason: '',
        },
    });

    // Stats - Mocked based on "CurrentUser" perspective or aggregated
    const stats = [
        { title: 'Annual Leave', used: 12, total: 20, color: 'text-blue-600', barColor: 'bg-blue-600', bg: 'bg-blue-50' },
        { title: 'Sick Leave', used: 3, total: 10, color: 'text-rose-600', barColor: 'bg-rose-600', bg: 'bg-rose-50' },
        { title: 'Casual Leave', used: 5, total: 12, color: 'text-amber-600', barColor: 'bg-amber-600', bg: 'bg-amber-50' },
    ];

    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(req => {
            const matchesSearch = req.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
            const matchesType = typeFilter === 'All' || req.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [leaveRequests, searchQuery, statusFilter, typeFilter]);

    const onSubmit = (data) => {
        const emp = employees.find(e => e.id === data.employeeId);
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (end < start) {
            addToast('End date cannot be before start date', 'error');
            return;
        }

        addLeaveRequest({
            ...data,
            employeeName: emp?.name || 'Unknown',
            days: diffDays,
        });
        setIsDrawerOpen(false);
        reset();
    };

    const handleExport = () => {
        if (filteredRequests.length === 0) {
            addToast('No data to export', 'warning');
            return;
        }
        downloadCSV(filteredRequests, `leave_requests_${new Date().toISOString().split('T')[0]}`);
        addToast('Leave report downloaded', 'success');
    };

    const columns = [
        {
            key: 'employeeName',
            header: 'Employee',
            render: (name, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={name} size="sm" />
                    <div>
                        <p className="font-medium text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">ID: {row.employeeId}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Leave Type',
            render: (type) => <Badge variant="outline">{type}</Badge>
        },
        {
            key: 'startDate',
            header: 'Duration',
            render: (_, row) => (
                <div className="text-sm">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                        <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                        {formatDate(row.startDate)} - {formatDate(row.endDate)}
                    </div>
                    <span className="text-xs text-slate-500 ml-5 block">{row.days} days</span>
                </div>
            )
        },
        {
            key: 'reason',
            header: 'Reason',
            render: (reason) => <span className="text-sm text-slate-600 truncate max-w-xs block" title={reason}>{reason}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (status) => {
                const variants = {
                    'Approved': 'success',
                    'Rejected': 'danger',
                    'Pending': 'warning'
                };
                return <Badge variant={variants[status]}>{status}</Badge>;
            }
        },
        {
            key: 'actions',
            header: '',
            render: (_, row) => row.status === 'Pending' && (
                <div className="flex gap-2 justify-end">
                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Approve"
                        onClick={() => approveLeave(row.id)}
                    >
                        <HiOutlineCheck className="w-4 h-4" />
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Reject"
                        onClick={() => rejectLeave(row.id)}
                    >
                        <HiOutlineX className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
                    <p className="text-slate-500 mt-1">Manage employee leave requests and balances</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={HiOutlineDownload} onClick={handleExport}>Export</Button>
                    <Button icon={HiOutlinePlus} onClick={() => setIsDrawerOpen(true)}>Apply Leave</Button>
                </div>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-5 border-t-4 border-transparent hover:border-t-4 transition-all duration-300" style={{ borderColor: stat.color.replace('text-', '') }}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-900">{stat.total - stat.used}</span>
                                    <span className="text-sm text-slate-400">/ {stat.total} days remaining</span>
                                </div>
                            </div>
                            <div className={`p-2 bg-slate-50 rounded-lg ${stat.color} ${stat.bg}`}>
                                <HiOutlineCalendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-1000 ${stat.barColor}`}
                                style={{ width: `${(stat.used / stat.total) * 100}%` }}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters & Table */}
            <Card className="overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800">Requests</h3>
                            <Badge variant="secondary" className="px-2">{filteredRequests.length}</Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                {LEAVE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table columns={columns} data={filteredRequests} />
                </div>

                {filteredRequests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiOutlineSearch className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-medium">No requests found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </Card>

            {/* Apply Leave Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Apply for Leave"
                size="md"
                footer={
                    <div className="flex gap-2 justify-end w-full">
                        <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit(onSubmit)}>Submit Request</Button>
                    </div>
                }
            >
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Employee</label>
                        <Controller
                            name="employeeId"
                            control={control}
                            render={({ field }) => (
                                <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Employee</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {LEAVE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <input type="date" {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                )}
                            />
                            {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <input type="date" {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                )}
                            />
                            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                        <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                                <textarea rows="3" {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Briefly describe the reason..." />
                            )}
                        />
                        {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default Leave;
