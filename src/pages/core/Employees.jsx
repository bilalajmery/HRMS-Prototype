import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineUserAdd,
    HiOutlineDownload,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineViewGrid,
    HiOutlineMenu,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineOfficeBuilding,
    HiOutlineCalendar,
    HiOutlineIdentification,
    HiOutlineDotsVertical,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
import { formatDate, countBy, downloadCSV, cn } from '../../utils/helpers';
import { CHART_COLORS, DEPARTMENTS, EMPLOYEE_STATUSES } from '../../utils/constants';
import SEO from '../../components/common/SEO';

// Validation Schema
const employeeSchema = z.object({
    name: z.string().min(1, 'Full Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    status: z.string().min(1, 'Status is required'),
    joinDate: z.string().min(1, 'Joining Date is required'),
    phone: z.string().optional(),
});

const Employees = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
    const [viewMode, setViewMode] = useState('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deptFilter, setDeptFilter] = useState('All');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view'); // view, add, edit
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Form Setup
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: '',
            email: '',
            department: '',
            designation: '',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            phone: '',
        },
    });

    // Filtered Data
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const matchesSearch =
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
            const matchesDept = deptFilter === 'All' || emp.department === deptFilter;

            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [employees, searchQuery, statusFilter, deptFilter]);

    // Statistics
    const stats = useMemo(() => {
        const total = employees.length;
        const active = employees.filter(e => e.status === 'Active').length;
        const inactive = employees.filter(e => e.status === 'Inactive').length;
        const onLeave = employees.filter(e => e.status === 'On Leave').length;

        return {
            total,
            active,
            activePercent: total > 0 ? Math.round((active / total) * 100) : 0,
            inactive,
            onLeave,
            departments: new Set(employees.map(e => e.department)).size,
            probation: employees.filter(e => e.status === 'Probation').length,
        };
    }, [employees]);

    // Chart Data
    const chartData = useMemo(() => ({
        deptSeries: countBy(employees, 'department').map(d => d.count),
        deptLabels: countBy(employees, 'department').map(d => d.name),
        statusSeries: [{
            name: 'Employees',
            data: countBy(employees, 'status').map(s => s.count)
        }],
        statusLabels: countBy(employees, 'status').map(s => s.name),
    }), [employees]);

    // Handlers
    const handleOpenDrawer = (mode, employee = null) => {
        setDrawerMode(mode);
        setSelectedEmployee(employee);

        if (mode === 'add') {
            reset({
                name: '',
                email: '',
                department: '',
                designation: '',
                status: 'Active',
                joinDate: new Date().toISOString().split('T')[0],
                phone: '',
            });
        } else if (employee) {
            reset({
                name: employee.name,
                email: employee.email,
                department: employee.department,
                designation: employee.designation,
                status: employee.status,
                joinDate: employee.joinDate,
                phone: employee.phone || '',
            });
        }

        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        if (drawerMode === 'add') {
            addEmployee(data);
        } else if (drawerMode === 'edit' && selectedEmployee) {
            updateEmployee(selectedEmployee.id, data);
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedEmployee && window.confirm('Are you sure you want to remove this employee?')) {
            deleteEmployee(selectedEmployee.id);
            setDrawerOpen(false);
        }
    };

    const handleExport = () => {
        downloadCSV(filteredEmployees, 'employee_directory');
    };

    // Table Columns
    const columns = [
        {
            key: 'name',
            header: 'Employee',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={row.name} src={row.avatar} />
                    <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.designation}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'department',
            header: 'Department',
            sortable: true,
            render: (dept) => (
                <span className="flex items-center gap-1.5">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-slate-400" />
                    {dept}
                </span>
            ),
        },
        {
            key: 'contact',
            header: 'Contact',
            render: (_, row) => (
                <div className="flex flex-col text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 mb-0.5">
                        <HiOutlineMail className="w-3.5 h-3.5" />
                        {row.email}
                    </span>
                    {row.phone && (
                        <span className="flex items-center gap-1.5">
                            <HiOutlinePhone className="w-3.5 h-3.5" />
                            {row.phone}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (status) => <Badge>{status}</Badge>,
        },
        {
            key: 'joinDate',
            header: 'Joined',
            sortable: true,
            render: (date) => (
                <span className="text-slate-600 font-medium">{formatDate(date, 'MMM dd, yyyy')}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            width: '50px',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="!p-1.5"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDrawer('view', row);
                    }}
                >
                    <HiOutlineDotsVertical className="w-5 h-5" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <SEO
                title="Employee Directory"
                description="Browse and manage your organization's employee directory. View profiles, departments, and employment status."
            />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
                        <p className="text-slate-500 mt-1">Manage your organization's workforce</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={HiOutlineDownload} onClick={handleExport}>
                            Export
                        </Button>
                        <Button icon={HiOutlineUserAdd} onClick={() => handleOpenDrawer('add')}>
                            Add Employee
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <p className="text-sm font-medium text-slate-500">Total Employees</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm font-medium text-slate-500">Active</p>
                        <div className="flex items-end gap-2 mt-1">
                            <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 rounded-full mb-1">
                                {stats.activePercent}%
                            </span>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm font-medium text-slate-500">Departments</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.departments}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm font-medium text-slate-500">On Leave</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.onLeave}</p>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <Card.Header>
                            <Card.Title>Department Distribution</Card.Title>
                        </Card.Header>
                        <DonutChart
                            series={chartData.deptSeries}
                            labels={chartData.deptLabels}
                            height={250}
                        />
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title>Employment Status</Card.Title>
                        </Card.Header>
                        <BarChart
                            series={chartData.statusSeries}
                            categories={chartData.statusLabels}
                            horizontal={true}
                            height={250}
                            colors={[CHART_COLORS.primary[5]]}
                        />
                    </Card>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="All">All Status</option>
                            {EMPLOYEE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="All">All Departments</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <div className="border-l border-slate-200 h-8 mx-1" />

                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={cn(
                                    'p-1.5 rounded-md transition-all',
                                    viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                )}
                            >
                                <HiOutlineMenu className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'p-1.5 rounded-md transition-all',
                                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                )}
                            >
                                <HiOutlineViewGrid className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Display */}
                {viewMode === 'table' ? (
                    <Table
                        columns={columns}
                        data={filteredEmployees}
                        onRowClick={(row) => handleOpenDrawer('view', row)}
                        pagination
                        pageSize={10}
                        sortable
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEmployees.map((emp) => (
                            <Card
                                key={emp.id}
                                hover
                                onClick={() => handleOpenDrawer('view', emp)}
                                className="group cursor-pointer"
                            >
                                <div className="flex flex-col items-center text-center p-2">
                                    <Avatar name={emp.name} src={emp.avatar} size="xl" className="mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">{emp.name}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{emp.designation}</p>
                                    <Badge className="mb-4">{emp.status}</Badge>

                                    <div className="w-full border-t border-slate-100 pt-4 flex flex-col gap-2 text-sm text-slate-600">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-slate-400">Department</span>
                                            <span className="font-medium">{emp.department}</span>
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-slate-400">Joined</span>
                                            <span className="font-medium">{formatDate(emp.joinDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Slide-over Drawer */}
                <Drawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    title={
                        drawerMode === 'add' ? 'Add New Employee' :
                            drawerMode === 'edit' ? 'Edit Employee' :
                                'Employee Profile'
                    }
                    size="lg"
                    footer={
                        drawerMode === 'view' ? (
                            <>
                                <Button
                                    variant="danger"
                                    icon={HiOutlineTrash}
                                    onClick={handleDelete}
                                >
                                    Remove Employee
                                </Button>
                                <Button
                                    icon={HiOutlinePencil}
                                    onClick={() => setDrawerMode('edit')}
                                >
                                    Edit Profile
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit(onSubmit)}>
                                    {drawerMode === 'add' ? 'Add Employee' : 'Save Changes'}
                                </Button>
                            </>
                        )
                    }
                >
                    {drawerMode === 'view' && selectedEmployee ? (
                        <div className="space-y-8">
                            {/* Header Info */}
                            <div className="flex items-center gap-4">
                                <Avatar name={selectedEmployee.name} src={selectedEmployee.avatar} size="2xl" />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.name}</h3>
                                    <p className="text-slate-500">{selectedEmployee.designation}</p>
                                    <div className="mt-2 text-sm text-slate-400">{selectedEmployee.id}</div>
                                </div>
                                <div className="ml-auto">
                                    <Badge size="lg">{selectedEmployee.status}</Badge>
                                </div>
                            </div>

                            {/* Profile Sections */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                                        Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500">Email Address</label>
                                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                                <HiOutlineMail className="w-4 h-4 text-slate-400" />
                                                {selectedEmployee.email}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Phone Number</label>
                                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                                <HiOutlinePhone className="w-4 h-4 text-slate-400" />
                                                {selectedEmployee.phone || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                                        Employment Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500">Department</label>
                                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                                <HiOutlineOfficeBuilding className="w-4 h-4 text-slate-400" />
                                                {selectedEmployee.department}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Joining Date</label>
                                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                                <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                                                {formatDate(selectedEmployee.joinDate)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Employee ID</label>
                                            <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                                                <HiOutlineIdentification className="w-4 h-4 text-slate-400" />
                                                {selectedEmployee.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="John Doe"
                                            />
                                        )}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="email"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="john@company.com"
                                                />
                                            )}
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="+1 555-0000"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Department <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="department"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                >
                                                    <option value="">Select Department</option>
                                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            )}
                                        />
                                        {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Designation <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="designation"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Software Engineer"
                                                />
                                            )}
                                        />
                                        {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                >
                                                    {EMPLOYEE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Joining Date <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="joinDate"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="date"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                        />
                                        {errors.joinDate && <p className="mt-1 text-xs text-red-500">{errors.joinDate.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Drawer>
            </div>
        </>
    );
};

export default Employees;
