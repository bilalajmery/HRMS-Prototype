import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineDesktopComputer,
    HiOutlineDownload,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserAdd,
    HiOutlineReply,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import Modal from '../../components/common/Modal';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
import {
    formatCurrency,
    countBy,
    downloadCSV,
    cn
} from '../../utils/helpers';
import { CHART_COLORS, ASSET_TYPES, ASSET_STATUSES, TYPE_ICONS } from '../../utils/constants';

// Validation Schema
const assetSchema = z.object({
    name: z.string().min(1, 'Asset Name is required'),
    type: z.string().min(1, 'Type is required'),
    serialNumber: z.string().min(1, 'Serial Number is required'),
    status: z.string().min(1, 'Status is required'),
    purchaseDate: z.string().min(1, 'Purchase Date is required'),
    value: z.number().min(0, 'Value must be positive'),
});

const Assets = () => {
    const { assets, employees, addAsset, updateAsset, assignAsset, returnAsset } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Drawer/Modal State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedAsset, setSelectedAsset] = useState(null);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            name: '',
            type: 'Laptop',
            serialNumber: '',
            status: 'Available',
            purchaseDate: new Date().toISOString().split('T')[0],
            value: 0,
        },
    });

    // Filtered Data
    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch =
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (asset.assignedName && asset.assignedName.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesType = typeFilter === 'All' || asset.type === typeFilter;
            const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [assets, searchQuery, typeFilter, statusFilter]);

    // Statistics
    const stats = useMemo(() => {
        const total = assets.length;
        const assigned = assets.filter(a => a.status === 'Assigned').length;
        const available = assets.filter(a => a.status === 'Available').length;
        const maintenance = assets.filter(a => a.status === 'Maintenance').length;
        const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

        return { total, assigned, available, maintenance, totalValue };
    }, [assets]);

    // Chart Data
    const chartData = useMemo(() => ({
        typeSeries: countBy(assets, 'type').map(t => t.count),
        typeLabels: countBy(assets, 'type').map(t => t.name),
        statusSeries: [{
            name: 'Assets',
            data: countBy(assets, 'status').map(s => s.count)
        }],
        statusLabels: countBy(assets, 'status').map(s => s.name),
    }), [assets]);

    // Handlers
    const handleOpenDrawer = (mode, asset = null) => {
        setDrawerMode(mode);
        setSelectedAsset(asset);

        if (mode === 'add') {
            reset({
                name: '',
                type: 'Laptop',
                serialNumber: '',
                status: 'Available',
                purchaseDate: new Date().toISOString().split('T')[0],
                value: 0,
            });
        } else if (asset) {
            reset({
                name: asset.name,
                type: asset.type,
                serialNumber: asset.serialNumber,
                status: asset.status,
                purchaseDate: asset.purchaseDate,
                value: asset.value,
            });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        if (drawerMode === 'add') {
            addAsset({ ...data, assignedTo: null, assignedName: null });
        } else if (drawerMode === 'edit' && selectedAsset) {
            updateAsset(selectedAsset.id, data);
        }
        setDrawerOpen(false);
    };

    const handleAssign = () => {
        if (selectedAsset && selectedEmployeeId) {
            const employee = employees.find(e => e.id === selectedEmployeeId);
            if (employee) {
                assignAsset(selectedAsset.id, employee.id, employee.name);
                setAssignModalOpen(false);
                setSelectedEmployeeId('');
            }
        }
    };

    const handleReturn = (asset) => {
        if (window.confirm(`Confirm return of ${asset.name} from ${asset.assignedName}?`)) {
            returnAsset(asset.id);
        }
    };

    const columns = [
        {
            key: 'name',
            header: 'Asset',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                        {TYPE_ICONS.asset[row.type] || '📦'}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.serialNumber}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            sortable: true,
            render: (type) => <span className="text-slate-600">{type}</span>,
        },
        {
            key: 'assignedName',
            header: 'Assigned To',
            sortable: true,
            render: (name) => name ? (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {name.charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium">{name}</span>
                </div>
            ) : (
                <span className="text-slate-400 italic">—</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (status) => <Badge>{status}</Badge>,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '180px',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'Available' ? (
                        <Button
                            size="xs"
                            variant="primary"
                            icon={HiOutlineUserAdd}
                            onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); setAssignModalOpen(true); }}
                        >
                            Assign
                        </Button>
                    ) : row.status === 'Assigned' ? (
                        <Button
                            size="xs"
                            variant="secondary"
                            icon={HiOutlineReply}
                            onClick={(e) => { e.stopPropagation(); handleReturn(row); }}
                        >
                            Return
                        </Button>
                    ) : null}

                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenDrawer('edit', row); }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors ml-1"
                    >
                        <HiOutlinePencil className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
                    <p className="text-slate-500 mt-1">Track company hardware and equipment assignments</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={HiOutlineDownload} onClick={() => downloadCSV(filteredAssets, 'assets')}>
                        Export
                    </Button>
                    <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>
                        Add Asset
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Assets</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <HiOutlineDesktopComputer className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Assigned</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.assigned}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <HiOutlineUserAdd className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Available</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.available}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Value</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalValue)}</p>
                        </div>
                        <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full self-start">
                            USD
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Asset Distribution</Card.Title>
                    </Card.Header>
                    <DonutChart
                        series={chartData.typeSeries}
                        labels={chartData.typeLabels}
                        height={250}
                    />
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Asset Status</Card.Title>
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

            {/* Filters/Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1 lg:w-96 w-full">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search asset name, serial, or employee..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Types</option>
                        {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        {ASSET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredAssets}
                onRowClick={(row) => handleOpenDrawer('view', row)}
                pagination
                pageSize={10}
                sortable
            />

            {/* Asset Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Add New Asset' : drawerMode === 'edit' ? 'Edit Asset' : 'Asset Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        <Button onClick={() => setDrawerMode('edit')} icon={HiOutlinePencil} className="w-full">
                            Edit Asset
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)}>
                                {drawerMode === 'add' ? 'Add Asset' : 'Save Changes'}
                            </Button>
                        </>
                    )
                }
            >
                {drawerMode === 'view' && selectedAsset ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
                                {TYPE_ICONS.asset[selectedAsset.type]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedAsset.name}</h3>
                                <p className="text-slate-500 font-mono text-sm">{selectedAsset.serialNumber}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Status</label>
                                <div className="mt-1"><Badge>{selectedAsset.status}</Badge></div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Value</label>
                                <p className="mt-1 text-slate-900 font-medium">{formatCurrency(selectedAsset.value)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Type</label>
                                <p className="mt-1 text-slate-900 font-medium">{selectedAsset.type}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Purchase Date</label>
                                <p className="mt-1 text-slate-900 font-medium">{selectedAsset.purchaseDate}</p>
                            </div>
                        </div>

                        {selectedAsset.assignedTo && (
                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">Currently Assigned To</h4>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                                        {selectedAsset.assignedName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{selectedAsset.assignedName}</p>
                                        <p className="text-xs text-blue-600">Employee ID: {selectedAsset.assignedTo}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Asset Name <span className="text-red-500">*</span></label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. MacBook Pro 14" />
                                )}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type <span className="text-red-500">*</span></label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            {ASSET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Serial Number <span className="text-red-500">*</span></label>
                                <Controller
                                    name="serialNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="SN-XXXX" />
                                    )}
                                />
                                {errors.serialNumber && <p className="mt-1 text-xs text-red-500">{errors.serialNumber.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Value ($)</label>
                                <Controller
                                    name="value"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                                            placeholder="0.00"
                                        />
                                    )}
                                />
                                {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Date</label>
                            <Controller
                                name="purchaseDate"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )}
                            />
                        </div>
                    </form>
                )}
            </Drawer>

            {/* Assignment Modal */}
            <Modal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Assign Asset"
                description={`Assigning ${selectedAsset?.name} to an employee`}
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssign} disabled={!selectedEmployeeId}>Confirm Assignment</Button>
                    </>
                }
            >
                <div className="space-y-4 py-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        >
                            <option value="">-- Choose Employee --</option>
                            {employees.filter(e => e.status === 'Active').map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                        <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
                        <p>The asset status will automatically change to "Assigned" once confirmed.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Assets;
