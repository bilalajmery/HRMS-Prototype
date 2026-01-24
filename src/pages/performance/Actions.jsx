import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineLightningBolt,
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineCheckCircle,
    HiOutlineExclamation,
    HiOutlineClock,
    HiOutlineTrash,
    HiOutlinePencil
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Drawer from '../../components/common/Drawer';
import Table from '../../components/common/Table';
import { formatDate } from '../../utils/helpers';

const actionSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    type: z.string().min(1, 'Action Type is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
});

const Actions = () => {
    const { employees } = useStore();

    // Mock Data
    const [actions, setActions] = useState([
        { id: '1', employeeId: 'EMP005', employeeName: 'David Lee', type: 'PIP', description: 'Performance Improvement Plan due to low sales output.', startDate: '2024-01-10', endDate: '2024-02-10', status: 'Active' },
        { id: '2', employeeId: 'EMP002', employeeName: 'Michael Chen', type: 'Training', description: 'Advanced React Training for skill upgrade.', startDate: '2024-01-15', endDate: '2024-01-20', status: 'Completed' },
    ]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedAction, setSelectedAction] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(actionSchema),
        defaultValues: {
            employeeId: '',
            type: 'PIP',
            description: '',
            startDate: '',
            endDate: '',
            status: 'Active',
        },
    });

    const handleOpenDrawer = (mode, action = null) => {
        setDrawerMode(mode);
        setSelectedAction(action);
        if (mode === 'add') {
            reset({
                employeeId: '',
                type: 'PIP',
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                status: 'Active',
            });
        } else if (action) {
            reset({
                employeeId: action.employeeId,
                type: action.type,
                description: action.description,
                startDate: action.startDate,
                endDate: action.endDate,
                status: action.status,
            });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const emp = employees.find(e => e.id === data.employeeId);
        const newAction = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            employeeName: emp?.name || 'Unknown',
        };

        if (drawerMode === 'add') {
            setActions([...actions, newAction]);
        } else if (drawerMode === 'edit' && selectedAction) {
            setActions(actions.map(a => a.id === selectedAction.id ? { ...a, ...newAction, id: a.id } : a));
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedAction && window.confirm('Remove this action record?')) {
            setActions(actions.filter(a => a.id !== selectedAction.id));
            setDrawerOpen(false);
        }
    };

    const columns = [
        {
            key: 'employeeName',
            header: 'Employee',
            render: (name) => <span className="font-medium text-slate-900">{name}</span>
        },
        {
            key: 'type',
            header: 'Action Type',
            render: (type) => <Badge variant={type === 'PIP' ? 'danger' : 'info'}>{type}</Badge>
        },
        {
            key: 'description',
            header: 'Description',
            render: (desc) => <span className="truncate max-w-xs block" title={desc}>{desc}</span>
        },
        {
            key: 'startDate',
            header: 'Start Date',
            render: (date) => formatDate(date)
        },
        {
            key: 'status',
            header: 'Status',
            render: (status) => <Badge>{status}</Badge>
        },
        {
            key: 'actions',
            header: '',
            width: '100px',
            render: (_, row) => (
                <Button variant="ghost" size="xs" onClick={() => handleOpenDrawer('view', row)}>View</Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Performance Actions</h1>
                    <p className="text-slate-500 mt-1">Manage PIPs, warnings, and development plans</p>
                </div>
                <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>Initiate Action</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-red-500">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Active PIPs</p>
                            <p className="text-2xl font-bold text-slate-900">{actions.filter(a => a.type === 'PIP' && a.status === 'Active').length}</p>
                        </div>
                        <HiOutlineExclamation className="w-8 h-8 text-red-500 p-1 bg-red-50 rounded-lg" />
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Training Assigned</p>
                            <p className="text-2xl font-bold text-slate-900">{actions.filter(a => a.type === 'Training').length}</p>
                        </div>
                        <HiOutlineLightningBolt className="w-8 h-8 text-blue-500 p-1 bg-blue-50 rounded-lg" />
                    </div>
                </Card>
            </div>

            <Table columns={columns} data={actions} />

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Initiate Action' : drawerMode === 'edit' ? 'Edit Action' : 'Action Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="danger" icon={HiOutlineTrash} onClick={handleDelete}>Delete</Button>
                            <Button icon={HiOutlinePencil} onClick={() => setDrawerMode('edit')}>Edit</Button>
                        </div>
                    ) : (
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)}>{drawerMode === 'add' ? 'Create' : 'Save'}</Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedAction ? (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-900">{selectedAction.employeeName}</h3>
                            <Badge className="mt-2">{selectedAction.type}</Badge>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold">Description</label>
                            <p className="mt-1 text-slate-800 bg-white p-3 border border-slate-200 rounded-lg">{selectedAction.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Start Date</label>
                                <p className="font-medium">{formatDate(selectedAction.startDate)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">End Date</label>
                                <p className="font-medium">{selectedAction.endDate ? formatDate(selectedAction.endDate) : 'Ongoing'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Status</label>
                                <div className="mt-1"><Badge>{selectedAction.status}</Badge></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Employee</label>
                            <Controller
                                name="employeeId"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="">Select Employee</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                )}
                            />
                            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            <option value="PIP">PIP</option>
                                            <option value="Training">Training</option>
                                            <option value="Warning">Warning</option>
                                            <option value="Promotion">Promotion Plan</option>
                                        </select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea {...field} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )}
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                    )}
                                />
                                {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">End Date (Optional)</label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Actions;
