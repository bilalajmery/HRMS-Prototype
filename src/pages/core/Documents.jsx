import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineDocumentAdd,
    HiOutlineDownload,
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCloudUpload,
    HiOutlineDocumentText,
    HiOutlineUsers,
    HiOutlineExclamation,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import DonutChart from '../../components/charts/DonutChart';
import AreaChart from '../../components/charts/AreaChart';
import {
    formatDate,
    countBy,
    downloadCSV,
    cn,
    getDaysUntilExpiry,
    isExpiringSoon,
    isExpired
} from '../../utils/helpers';
import { CHART_COLORS, DOCUMENT_TYPES, TYPE_ICONS } from '../../utils/constants';

// Zod schema
const documentSchema = z.object({
    name: z.string().min(1, 'Document Name is required'),
    type: z.string().min(1, 'Document Type is required'),
    employeeId: z.string().min(1, 'Employee is required'),
    expiryDate: z.string().nullable(),
});

const Documents = () => {
    const { documents, employees, addDocument, updateDocument, deleteDocument } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view'); // view, add, edit
    const [selectedDoc, setSelectedDoc] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            name: '',
            type: 'Contract',
            employeeId: '',
            expiryDate: null,
        },
    });

    // Derived State
    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) => {
            const matchesSearch =
                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter === 'All' || doc.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [documents, searchQuery, typeFilter]);

    const stats = useMemo(() => {
        const total = documents.length;
        const expiredCount = documents.filter(d => isExpired(d.expiryDate)).length;
        const expiringSoonCount = documents.filter(d => isExpiringSoon(d.expiryDate)).length;
        const active = total - expiredCount;

        return {
            total,
            active,
            expired: expiredCount,
            expiringSoon: expiringSoonCount,
            missingContracts: 0, // Placeholder logic
            complianceRate: total > 0 ? Math.round((active / total) * 100) : 100,
        };
    }, [documents]);

    const chartData = useMemo(() => ({
        typeSeries: countBy(documents, 'type').map(t => t.count),
        typeLabels: countBy(documents, 'type').map(t => t.name),
        trendSeries: [{
            name: 'Uploads',
            data: [12, 19, 15, 25, 22, 30] // Mock data
        }],
        trendLabels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    }), [documents]);

    // Handlers
    const handleOpenDrawer = (mode, doc = null) => {
        setDrawerMode(mode);
        setSelectedDoc(doc);

        if (mode === 'add') {
            reset({
                name: '',
                type: 'Contract',
                employeeId: '',
                expiryDate: null,
            });
        } else if (doc) {
            reset({
                name: doc.name,
                type: doc.type,
                employeeId: doc.employeeId,
                expiryDate: doc.expiryDate,
            });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const employee = employees.find(e => e.id === data.employeeId);
        const docData = {
            ...data,
            employeeName: employee?.name || 'Unknown',
            status: isExpired(data.expiryDate) ? 'Expired' :
                isExpiringSoon(data.expiryDate) ? 'Expiring' : 'Active',
            uploadDate: new Date().toISOString().split('T')[0],
            fileSize: '1.2 MB' // Mock size
        };

        if (drawerMode === 'add') {
            addDocument(docData);
        } else if (drawerMode === 'edit' && selectedDoc) {
            updateDocument(selectedDoc.id, docData);
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedDoc && window.confirm('Are you sure you want to delete this document?')) {
            deleteDocument(selectedDoc.id);
            setDrawerOpen(false);
        }
    };

    const renderStatus = (doc) => {
        if (isExpired(doc.expiryDate)) return <Badge variant="default" className="bg-red-100 text-red-700">Expired</Badge>;
        if (isExpiringSoon(doc.expiryDate)) return <Badge variant="default" className="bg-amber-100 text-amber-700">Expiring</Badge>;
        return <Badge variant="default" className="bg-green-100 text-green-700">Active</Badge>;
    };

    const columns = [
        {
            key: 'name',
            header: 'Document',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
                        {TYPE_ICONS.document[row.type] || '📄'}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.type}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'employeeName',
            header: 'Employee',
            sortable: true,
            render: (name) => <span className="text-slate-700 font-medium">{name}</span>,
        },
        {
            key: 'uploadDate',
            header: 'Uploaded',
            sortable: true,
            render: (date) => <span className="text-slate-500">{formatDate(date)}</span>,
        },
        {
            key: 'expiryDate',
            header: 'Expiry',
            sortable: true,
            render: (date) => (
                <span className={cn('text-sm', isExpiringSoon(date) ? 'text-amber-600 font-medium' : 'text-slate-500')}>
                    {formatDate(date) || '—'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (_, row) => renderStatus(row),
        },
        {
            key: 'actions',
            header: '',
            width: '120px',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenDrawer('view', row); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <HiOutlineEye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenDrawer('edit', row); }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                        <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete document?')) deleteDocument(row.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <HiOutlineTrash className="w-5 h-5" />
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
                    <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
                    <p className="text-slate-500 mt-1">Employee documents, contracts, and compliance tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={HiOutlineDownload} onClick={() => downloadCSV(filteredDocuments, 'documents')}>
                        Export
                    </Button>
                    <Button icon={HiOutlineDocumentAdd} onClick={() => handleOpenDrawer('add')}>
                        Upload Doc
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Documents</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <HiOutlineDocumentText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <HiOutlineUsers className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.expiringSoon}</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <HiOutlineExclamation className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Expired</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.expired}</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <HiOutlineExclamation className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Document Types</Card.Title>
                    </Card.Header>
                    <DonutChart
                        series={chartData.typeSeries}
                        labels={chartData.typeLabels}
                        height={250}
                    />
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Upload Trend</Card.Title>
                    </Card.Header>
                    <AreaChart
                        series={chartData.trendSeries}
                        categories={chartData.trendLabels}
                        height={250}
                    />
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="All">All Types</option>
                    {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredDocuments}
                onRowClick={(row) => handleOpenDrawer('view', row)}
                pagination
                pageSize={10}
                sortable
            />

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Upload Document' : drawerMode === 'edit' ? 'Edit Document' : 'Document Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        <Button variant="danger" icon={HiOutlineTrash} onClick={handleDelete}>Delete</Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)}>
                                {drawerMode === 'add' ? 'Upload' : 'Save Changes'}
                            </Button>
                        </>
                    )
                }
            >
                {drawerMode === 'view' && selectedDoc ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                    {TYPE_ICONS.document[selectedDoc.type]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{selectedDoc.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedDoc.fileSize} • {selectedDoc.type}</p>
                                </div>
                            </div>
                            {renderStatus(selectedDoc)}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-semibold">Employee</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                        {selectedDoc.employeeName.charAt(0)}
                                    </div>
                                    <span className="text-slate-900 font-medium">{selectedDoc.employeeName}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Uploaded On</label>
                                    <p className="mt-1 text-slate-900">{formatDate(selectedDoc.uploadDate)}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Expires On</label>
                                    <p className={cn("mt-1", isExpiringSoon(selectedDoc.expiryDate) ? "text-amber-600 font-bold" : "text-slate-900")}>
                                        {selectedDoc.expiryDate ? formatDate(selectedDoc.expiryDate) : 'Never'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <Button variant="outline" className="w-full" icon={HiOutlineDownload}>Download File</Button>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Document Name <span className="text-red-500">*</span></label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Employment Contract" />
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
                                            {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                                <Controller
                                    name="expiryDate"
                                    control={control}
                                    render={({ field }) => (
                                        <input {...field} type="date" value={field.value || ''} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Employee <span className="text-red-500">*</span></label>
                            <Controller
                                name="employeeId"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="">Select Employee</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                                    </select>
                                )}
                            />
                            {errors.employeeId && <p className="mt-1 text-xs text-red-500">{errors.employeeId.message}</p>}
                        </div>

                        {drawerMode === 'add' && (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                <HiOutlineCloudUpload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-500 mt-1">PDF, DOC, JPG up to 10MB</p>
                            </div>
                        )}
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Documents;
