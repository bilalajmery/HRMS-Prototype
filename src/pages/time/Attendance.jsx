import { useState, useMemo } from 'react';
import {
    HiOutlineClock,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineDownload,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineExclamation,
    HiOutlineSearch,
    HiOutlineFilter,
    HiDotsVertical,
    HiOutlineEye,
    HiOutlinePencil
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { formatDate, downloadCSV, cn } from '../../utils/helpers';
import useStore from '../../store/useStore';

const Attendance = () => {
    const { employees, addToast } = useStore();
    const [dateRange, setDateRange] = useState({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Attendance Data Generation based on employees
    const rawAttendanceData = useMemo(() => {
        return employees.map((emp, index) => {
            // Deterministic status based on index for demo purposes
            let status = 'Present';
            if (index % 10 === 0) status = 'Late';
            else if (index % 15 === 0) status = 'Absent';
            else if (index % 20 === 0) status = 'On Leave';

            const checkIn = status === 'Absent' || status === 'On Leave' ? '-' : status === 'Late' ? '09:45 AM' : '09:00 AM';
            const checkOut = status === 'Absent' || status === 'On Leave' ? '-' : '06:00 PM';
            const hours = status === 'Absent' || status === 'On Leave' ? '-' : '9h 0m';

            return {
                id: `ATT-${index}`,
                employeeId: emp.id,
                employeeName: emp.name,
                designation: emp.designation,
                department: emp.department,
                date: new Date().toISOString().split('T')[0],
                checkIn,
                checkOut,
                workHours: hours,
                status,
                avatar: emp.avatar
            };
        });
    }, [employees]);

    // Filter Logic
    const filteredData = useMemo(() => {
        return rawAttendanceData.filter(item => {
            const matchesSearch = item.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDepartment = departmentFilter === 'All' || item.department === departmentFilter;
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [rawAttendanceData, searchQuery, departmentFilter, statusFilter]);

    // Stats Logic
    const stats = useMemo(() => [
        {
            title: 'Present',
            value: rawAttendanceData.filter(a => a.status === 'Present').length,
            total: rawAttendanceData.length,
            icon: HiOutlineCheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            barColor: 'bg-emerald-500'
        },
        {
            title: 'Late',
            value: rawAttendanceData.filter(a => a.status === 'Late').length,
            total: rawAttendanceData.length,
            icon: HiOutlineClock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            barColor: 'bg-amber-500'
        },
        {
            title: 'Absent',
            value: rawAttendanceData.filter(a => a.status === 'Absent').length,
            total: rawAttendanceData.length,
            icon: HiOutlineXCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            barColor: 'bg-rose-500'
        },
        {
            title: 'On Leave',
            value: rawAttendanceData.filter(a => a.status === 'On Leave').length,
            total: rawAttendanceData.length,
            icon: HiOutlineCalendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            barColor: 'bg-blue-500'
        },
    ], [rawAttendanceData]);

    const handleExport = () => {
        const dataToExport = filteredData.map(({ avatar, ...rest }) => rest);
        if (dataToExport.length === 0) {
            addToast('No data to export', 'warning');
            return;
        }
        downloadCSV(dataToExport, `attendance_report_${new Date().toISOString().split('T')[0]}`);
        addToast('Attendance report downloaded', 'success');
    };

    const handleViewDetails = (id) => {
        addToast(`Viewing details for ${id}`, 'info');
        // Logic to open details modal would go here
    };

    const columns = [
        {
            key: 'employeeName',
            header: 'Employee',
            render: (name, row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={name} src={row.avatar} size="sm" />
                    <div>
                        <p className="font-medium text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{row.designation}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'department',
            header: 'Department',
            render: (dept) => <Badge variant="outline">{dept}</Badge>
        },
        {
            key: 'checkIn',
            header: 'Check In',
            render: (time) => <span className="font-medium font-mono text-slate-700">{time}</span>
        },
        {
            key: 'checkOut',
            header: 'Check Out',
            render: (time) => <span className="font-medium font-mono text-slate-700">{time}</span>
        },
        {
            key: 'workHours',
            header: 'Hours',
            render: (hours) => <span className="text-sm font-medium text-slate-600">{hours}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (status) => {
                const variants = {
                    'Present': 'success',
                    'Late': 'warning',
                    'Absent': 'danger',
                    'On Leave': 'info'
                };
                return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
            }
        },
        {
            key: 'actions',
            header: '',
            width: '100px',
            render: (_, row) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleViewDetails(row.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <HiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Correction Request"
                        onClick={() => addToast('Correction request feature coming soon', 'info')}
                    >
                        <HiOutlinePencil className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const departments = ['All', ...[...new Set(employees.map(e => e.department))]];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500 mt-1">Track daily attendance and work hours</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                        <HiOutlineCalendar className="text-slate-400 w-5 h-5" />
                        <span className="text-sm font-medium text-slate-700">{formatDate(dateRange.start)}</span>
                    </div>
                    <Button icon={HiOutlineDownload} onClick={handleExport}>Export Report</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const percentage = Math.round((stat.value / stat.total) * 100) || 0;

                    return (
                        <Card key={index} className="p-5 border-t-4 border-transparent hover:border-t-4 transition-all duration-300" style={{ borderColor: stat.color.replace('text-', '') }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                        <span className="text-xs text-slate-400">/ {stat.total}</span>
                                    </div>
                                </div>
                                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-1000 ${stat.barColor}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 text-right">{percentage}% of total</p>
                        </Card>
                    );
                })}
            </div>

            {/* Filters & Table */}
            <Card className="overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800">Daily Records</h3>
                            <Badge variant="secondary" className="px-2">{filteredData.length}</Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table columns={columns} data={filteredData} />
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiOutlineSearch className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-medium">No records found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Attendance;
