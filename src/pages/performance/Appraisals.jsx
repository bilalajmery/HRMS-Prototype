import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineClipboardCheck,
    HiOutlineDownload,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineInformationCircle,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import Avatar from '../../components/common/Avatar';
import { formatDate, downloadCSV, cn } from '../../utils/helpers';

// Schema
const appraisalSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    reviewPeriod: z.string().min(1, 'Review Period is required'),
    reviewerId: z.string().min(1, 'Reviewer is required'),
    date: z.string().min(1, 'Review Date is required'),
    status: z.string(),
    rating: z.number().optional(),
    feedback: z.string().optional(),
});

const Appraisals = () => {
    const { employees, user } = useStore();

    // Mock Appraisals Data (Since it wasn't in the initial store, I'll mock it locally or assume it's there. 
    // Checking store... Ah, 'reviews' wasn't explicitly in the store provided in summary, but I should probably add it or mock it here 
    // to make the page functional. I'll adhere to the layout and mock data for now, or use a local state if global isn't available.)

    // Actually, I'll add a simple local state management for appraisals for this demo since it wasn't in the core summary list of store slices.
    // Wait, I see "goals, candidates, interviews..." in store. No appraisals. I'll simulate it.

    const [appraisals, setAppraisals] = useState([
        { id: '1', employeeId: 'EMP001', employeeName: 'Sarah Wilson', reviewer: 'John Doe', period: 'Q4 2023', date: '2024-01-15', status: 'Completed', rating: 4.5, feedback: 'Excellent performance this quarter.' },
        { id: '2', employeeId: 'EMP002', employeeName: 'Michael Chen', reviewer: 'Jane Smith', period: 'Q4 2023', date: '2024-01-18', status: 'Pending', rating: 0, feedback: '' },
        { id: '3', employeeId: 'EMP003', employeeName: 'Emily Davis', reviewer: 'John Doe', period: 'Q4 2023', date: '2024-01-20', status: 'Scheduled', rating: 0, feedback: '' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(appraisalSchema),
        defaultValues: {
            employeeId: '',
            reviewPeriod: 'Q1 2024',
            reviewerId: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Scheduled',
            rating: 0,
            feedback: '',
        },
    });

    // Derived Data
    const filteredAppraisals = useMemo(() => {
        return appraisals.filter(app => {
            const matchesSearch =
                app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.period.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [appraisals, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: appraisals.length,
            completed: appraisals.filter(a => a.status === 'Completed').length,
            pending: appraisals.filter(a => a.status === 'Pending').length,
            scheduled: appraisals.filter(a => a.status === 'Scheduled').length,
        };
    }, [appraisals]);

    // Handlers
    const handleOpenDrawer = (mode, appraisal = null) => {
        setDrawerMode(mode);
        setSelectedAppraisal(appraisal);

        if (mode === 'add') {
            reset({
                employeeId: '',
                reviewPeriod: 'Q1 2024',
                reviewerId: user?.id || '', // Default to current user
                date: new Date().toISOString().split('T')[0],
                status: 'Scheduled',
                rating: 0,
                feedback: '',
            });
        } else if (appraisal) {
            reset({
                employeeId: appraisal.employeeId,
                reviewPeriod: appraisal.period,
                reviewerId: 'User', // Mock
                date: appraisal.date,
                status: appraisal.status,
                rating: appraisal.rating || 0,
                feedback: appraisal.feedback || '',
            });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const employee = employees.find(e => e.id === data.employeeId);
        const newAppraisal = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            employeeName: employee?.name || 'Unknown',
            period: data.reviewPeriod,
            reviewer: 'Current User', // Mock
        };

        if (drawerMode === 'add') {
            setAppraisals([...appraisals, newAppraisal]);
        } else if (drawerMode === 'edit' && selectedAppraisal) {
            setAppraisals(appraisals.map(a => a.id === selectedAppraisal.id ? { ...a, ...newAppraisal, id: a.id } : a));
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedAppraisal && window.confirm('Delete this appraisal?')) {
            setAppraisals(appraisals.filter(a => a.id !== selectedAppraisal.id));
            setDrawerOpen(false);
        }
    };

    const columns = [
        {
            key: 'employeeName',
            header: 'Employee',
            sortable: true,
            render: (name, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={name} size="sm" />
                    <div>
                        <p className="font-medium text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{row.employeeId}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'period',
            header: 'Period',
            sortable: true,
            render: (period) => <Badge variant="outline">{period}</Badge>,
        },
        {
            key: 'date',
            header: 'Review Date',
            sortable: true,
            render: (date) => <span className="text-slate-600">{formatDate(date)}</span>,
        },
        {
            key: 'reviewer',
            header: 'Reviewer',
            render: (name) => <span className="text-slate-600 text-sm">{name}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (status) => <Badge>{status}</Badge>,
        },
        {
            key: 'rating',
            header: 'Rating',
            render: (rating, row) => row.status === 'Completed' ? (
                <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">{rating}</span>
                    <span className="text-slate-400">/ 5</span>
                </div>
            ) : (
                <span className="text-slate-400">—</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            width: '100px',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); handleOpenDrawer('view', row) }}>View</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Performance Appraisals</h1>
                    <p className="text-slate-500 mt-1">Manage employee reviews and feedback cycles</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={HiOutlineDownload} onClick={() => downloadCSV(filteredAppraisals, 'appraisals')}>
                        Export
                    </Button>
                    <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>
                        Schedule Review
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <p className="text-sm font-medium text-slate-500">Total Reviews</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-slate-500">Pending Feedback</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-slate-500">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1 w-full lg:max-w-md">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by employee name or period..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                </select>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredAppraisals}
                onRowClick={(row) => handleOpenDrawer('view', row)}
                pagination
                pageSize={10}
                sortable
            />

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Schedule Appraisal' : drawerMode === 'edit' ? 'Edit Appraisal' : 'Appraisal Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="danger" icon={HiOutlineTrash} onClick={handleDelete}>Delete</Button>
                            <Button icon={HiOutlinePencil} onClick={() => setDrawerMode('edit')}>Edit</Button>
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)}>
                                {drawerMode === 'add' ? 'Schedule' : 'Save Changes'}
                            </Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedAppraisal ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <Avatar name={selectedAppraisal.employeeName} size="lg" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{selectedAppraisal.employeeName}</h3>
                                <p className="text-sm text-slate-500">ID: {selectedAppraisal.employeeId}</p>
                            </div>
                            <div className="ml-auto">
                                <Badge>{selectedAppraisal.status}</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Review Period</label>
                                <p className="mt-1 font-medium">{selectedAppraisal.period}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Review Date</label>
                                <p className="mt-1 font-medium">{formatDate(selectedAppraisal.date)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Reviewer</label>
                                <p className="mt-1 font-medium">{selectedAppraisal.reviewer}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Rating</label>
                                <p className="mt-1 font-bold text-lg text-blue-600">{selectedAppraisal.rating || '-'}/5</p>
                            </div>
                        </div>

                        {selectedAppraisal.feedback && (
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold mb-2 block">Manager Feedback</label>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                                    "{selectedAppraisal.feedback}"
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Employee <span className="text-red-500">*</span></label>
                            <Controller
                                name="employeeId"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white" disabled={drawerMode === 'edit'}>
                                        <option value="">Select Employee</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>)}
                                    </select>
                                )}
                            />
                            {errors.employeeId && <p className="mt-1 text-xs text-red-500">{errors.employeeId.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Review Period <span className="text-red-500">*</span></label>
                                <Controller
                                    name="reviewPeriod"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            <option value="Q1 2024">Q1 2024</option>
                                            <option value="Q2 2024">Q2 2024</option>
                                            <option value="Q3 2024">Q3 2024</option>
                                            <option value="Q4 2023">Q4 2023</option>
                                            <option value="Annual 2023">Annual 2023</option>
                                        </select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Review Date <span className="text-red-500">*</span></label>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                    )}
                                />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
                            </div>
                        </div>

                        {drawerMode === 'edit' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        )}
                                    />
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <HiOutlineClipboardCheck className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-slate-900">Evaluation</h4>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Rating (0-5)</label>
                                        <Controller
                                            name="rating"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    step="0.1"
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Feedback</label>
                                        <Controller
                                            name="feedback"
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    rows="4"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                                                    placeholder="Enter detailed feedback here..."
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Appraisals;
