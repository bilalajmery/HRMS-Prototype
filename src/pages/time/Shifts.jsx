import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    HiOutlineCalendar,
    HiOutlinePlus,
    HiOutlineClock,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineDownload,
    HiOutlineUsers
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Drawer from '../../components/common/Drawer';
import useStore from '../../store/useStore';
import { downloadCSV } from '../../utils/helpers';

const Shifts = () => {
    const { employees, addToast } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [shiftFilter, setShiftFilter] = useState('All');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Mock Shift Data
    const shiftsDefinition = [
        { id: '1', name: 'Morning Shift', time: '06:00 AM - 02:00 PM', color: 'border-blue-500 bg-blue-50', iconColor: 'text-blue-600', badgeColor: 'bg-blue-100 text-blue-700' },
        { id: '2', name: 'General Shift', time: '09:00 AM - 06:00 PM', color: 'border-green-500 bg-green-50', iconColor: 'text-green-600', badgeColor: 'bg-green-100 text-green-700' },
        { id: '3', name: 'Night Shift', time: '10:00 PM - 06:00 AM', color: 'border-purple-500 bg-purple-50', iconColor: 'text-purple-600', badgeColor: 'bg-purple-100 text-purple-700' },
    ];

    // Initialize mock roster state
    const [rosterData, setRosterData] = useState(() => {
        return employees.map((emp, idx) => ({
            employeeId: emp.id,
            name: emp.name,
            designation: emp.designation,
            department: emp.department,
            avatar: emp.avatar,
            shiftId: idx % 3 === 0 ? '1' : idx % 3 === 1 ? '2' : '3'
        }));
    });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            employeeId: '',
            shiftId: '2',
            startDate: new Date().toISOString().split('T')[0],
        }
    });

    // Filtering
    const filteredRoster = useMemo(() => {
        return rosterData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesShift = shiftFilter === 'All' || item.shiftId === shiftFilter;
            return matchesSearch && matchesShift;
        });
    }, [rosterData, searchQuery, shiftFilter]);

    // Derived Stats
    const stats = useMemo(() => {
        return shiftsDefinition.map(shift => ({
            ...shift,
            count: rosterData.filter(r => r.shiftId === shift.id).length
        }));
    }, [rosterData]);

    const handleAssignShift = (data) => {
        setRosterData(prev => prev.map(item => {
            if (item.employeeId === data.employeeId) {
                return { ...item, shiftId: data.shiftId };
            }
            return item;
        }));
        addToast('Shift assigned successfully', 'success');
        setIsDrawerOpen(false);
        reset();
    };

    const handleExport = () => {
        const exportData = filteredRoster.map(r => ({
            Name: r.name,
            Department: r.department,
            Shift: shiftsDefinition.find(s => s.id === r.shiftId)?.name || 'Unknown',
            Time: shiftsDefinition.find(s => s.id === r.shiftId)?.time || ''
        }));
        downloadCSV(exportData, 'shift_roster');
        addToast('Roster exported successfully', 'success');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Shift Management</h1>
                    <p className="text-slate-500 mt-1">Manage work schedules and employee shifts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={HiOutlineDownload} onClick={handleExport}>Export Roster</Button>
                    <Button icon={HiOutlinePlus} onClick={() => setIsDrawerOpen(true)}>Assign Shift</Button>
                </div>
            </div>

            {/* Shift Types & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(shift => (
                    <Card key={shift.id} className={`p-4 border-l-4 ${shift.color.split(' ')[0]} hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900">{shift.name}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1 mb-3">
                                    <HiOutlineClock className="w-4 h-4" />
                                    {shift.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineUsers className={`w-4 h-4 ${shift.iconColor}`} />
                                    <span className="font-medium text-slate-700">{shift.count} Employees</span>
                                </div>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Employee Roster */}
            <Card className="overflow-hidden">
                <Card.Header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <Card.Title>Current Roster</Card.Title>
                        <p className="text-xs text-slate-500 mt-1">Showing all active assignments</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                            value={shiftFilter}
                            onChange={(e) => setShiftFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Shifts</option>
                            {shiftsDefinition.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </Card.Header>

                <div className="divide-y divide-slate-100">
                    {filteredRoster.map(item => {
                        const shift = shiftsDefinition.find(s => s.id === item.shiftId);
                        return (
                            <div key={item.employeeId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar name={item.name} src={item.avatar} size="sm" />
                                    <div>
                                        <p className="font-medium text-slate-900">{item.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{item.designation}</span>
                                            <span>•</span>
                                            <span>{item.department}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${shift.badgeColor}`}>
                                            <HiOutlineClock className="w-3.5 h-3.5" />
                                            {shift.name}
                                        </span>
                                        <p className="text-xs text-slate-400 mt-1.5 text-right">{shift.time}</p>
                                    </div>
                                    <Button variant="ghost" size="xs">Change</Button>
                                </div>
                            </div>
                        );
                    })}

                    {filteredRoster.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No employees found matching filter</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Assign Shift Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Assign Shift"
                size="md"
                footer={
                    <div className="flex gap-2 justify-end w-full">
                        <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit(handleAssignShift)}>Save Assignment</Button>
                    </div>
                }
            >
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
                        <Controller
                            name="employeeId"
                            control={control}
                            rules={{ required: 'Please select an employee' }}
                            render={({ field }) => (
                                <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Employee</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Shift</label>
                        <Controller
                            name="shiftId"
                            control={control}
                            rules={{ required: 'Please select a shift' }}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {shiftsDefinition.map(shift => (
                                        <label key={shift.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${field.value === shift.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <input
                                                type="radio"
                                                {...field}
                                                value={shift.id}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-slate-900">{shift.name}</span>
                                                <span className="block text-xs text-slate-500">{shift.time}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Effective From</label>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <input type="date" {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            )}
                        />
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default Shifts;
