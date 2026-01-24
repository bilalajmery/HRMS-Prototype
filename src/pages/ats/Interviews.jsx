import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineCalendar,
    HiOutlineVideoCamera,
    HiOutlineLocationMarker,
    HiOutlinePlus,
    HiOutlineClock,
    HiOutlineUserGroup,
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineSearch,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Drawer from '../../components/common/Drawer';
import { formatDate, formatDateTime } from '../../utils/helpers';

const interviewSchema = z.object({
    candidateId: z.string().min(1, 'Candidate is required'),
    interviewerId: z.string().min(1, 'Interviewer is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    type: z.string().min(1, 'Type is required'),
    meetingLink: z.string().optional(),
    status: z.string(),
});

const Interviews = () => {
    const { interviews, candidates, employees, addInterview, updateInterview, deleteInterview } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedInterview, setSelectedInterview] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(interviewSchema),
        defaultValues: {
            candidateId: '',
            interviewerId: '',
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            type: 'Video',
            meetingLink: '',
            status: 'Scheduled',
        },
    });

    const filteredInterviews = useMemo(() => {
        return interviews.filter(i =>
            i.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.interviewerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [interviews, searchQuery]);

    const handleOpenDrawer = (mode, interview = null) => {
        setDrawerMode(mode);
        setSelectedInterview(interview);
        if (mode === 'add') {
            reset({ candidateId: '', interviewerId: '', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'Video', meetingLink: '', status: 'Scheduled' });
        } else if (interview) {
            reset({ ...interview });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const candidate = candidates.find(c => c.id === data.candidateId);
        const interviewer = employees.find(e => e.id === data.interviewerId);

        const interviewData = {
            ...data,
            candidateName: candidate?.name || 'Unknown',
            interviewerName: interviewer?.name || 'Unknown',
        };

        if (drawerMode === 'add') {
            addInterview(interviewData);
        } else if (drawerMode === 'edit' && selectedInterview) {
            updateInterview(selectedInterview.id, interviewData);
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedInterview && window.confirm('Cancel this interview?')) {
            deleteInterview(selectedInterview.id);
            setDrawerOpen(false);
        }
    };

    const columns = [
        {
            key: 'candidateName',
            header: 'Candidate',
            sortable: true,
            render: (name) => <span className="font-medium text-slate-900">{name}</span>
        },
        {
            key: 'date',
            header: 'Date & Time',
            sortable: true,
            render: (date, row) => (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-slate-700">{formatDate(date)}</span>
                    <span className="text-slate-500">{row.time}</span>
                </div>
            )
        },
        {
            key: 'interviewerName',
            header: 'Interviewer',
            render: (name) => <span className="text-slate-600">{name}</span>
        },
        {
            key: 'type',
            header: 'Type',
            render: (type) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    {type === 'Video' ? <HiOutlineVideoCamera className="w-4 h-4" /> : <HiOutlineLocationMarker className="w-4 h-4" />}
                    {type}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (status) => <Badge>{status}</Badge>
        },
        {
            key: 'actions',
            header: '',
            render: (_, row) => <Button variant="ghost" size="xs" onClick={() => handleOpenDrawer('view', row)}>Details</Button>
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
                    <p className="text-slate-500 mt-1">Schedule and manage candidate interviews</p>
                </div>
                <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>Schedule Interview</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Schedule Card */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <Card.Title>Upcoming Interviews</Card.Title>
                            <div className="relative w-64">
                                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Search..."
                                />
                            </div>
                        </Card.Header>
                        <Table columns={columns} data={filteredInterviews} pagination pageSize={5} />
                    </Card>
                </div>

                {/* Stats / Quick View */}
                <div className="space-y-4">
                    <Card className="p-4 bg-blue-50 border-blue-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <HiOutlineCalendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Scheduled Today</p>
                                <p className="text-2xl font-bold text-blue-900">{interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-bold text-slate-800 mb-4">Pending Feedback</h3>
                        <div className="space-y-3">
                            {interviews.filter(i => i.status === 'Completed').slice(0, 3).map(i => (
                                <div key={i.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{i.candidateName}</p>
                                        <p className="text-xs text-slate-500">{formatDate(i.date)}</p>
                                    </div>
                                    <Button size="xs" variant="outline">Rate</Button>
                                </div>
                            ))}
                            {interviews.filter(i => i.status === 'Completed').length === 0 && (
                                <p className="text-xs text-slate-400 italic">No interviews pending feedback.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Schedule Interview' : drawerMode === 'edit' ? 'Edit Interview' : 'Interview Details'}
                size="md"
                footer={
                    drawerMode === 'view' ? (
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="danger" icon={HiOutlineTrash} onClick={handleDelete}>Cancel</Button>
                            <Button icon={HiOutlinePencil} onClick={() => setDrawerMode('edit')}>Reschedule</Button>
                        </div>
                    ) : (
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>
                            <Button onClick={handleSubmit(onSubmit)}>{drawerMode === 'add' ? 'Schedule' : 'Update'}</Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedInterview ? (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <h3 className="text-xl font-bold text-slate-900">{selectedInterview.candidateName}</h3>
                            <p className="text-slate-500 text-sm mb-4">Interview with {selectedInterview.interviewerName}</p>
                            <Badge size="lg">{selectedInterview.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <HiOutlineCalendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Date</p>
                                    <p className="font-medium text-slate-900">{formatDate(selectedInterview.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                <HiOutlineClock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Time</p>
                                    <p className="font-medium text-slate-900">{selectedInterview.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg col-span-2">
                                {selectedInterview.type === 'Video' ? <HiOutlineVideoCamera className="w-5 h-5 text-slate-400" /> : <HiOutlineLocationMarker className="w-5 h-5 text-slate-400" />}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 uppercase font-bold">{selectedInterview.type}</p>
                                    {selectedInterview.meetingLink ? (
                                        <a href={selectedInterview.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">{selectedInterview.meetingLink}</a>
                                    ) : (
                                        <p className="text-slate-900 font-medium">Headquarters, Room 302</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Candidate</label>
                                <Controller name="candidateId" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="">Select Candidate</option>
                                        {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                )} />
                                {errors.candidateId && <p className="text-xs text-red-500 mt-1">{errors.candidateId.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Interviewer</label>
                                <Controller name="interviewerId" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="">Select Interviewer</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                )} />
                                {errors.interviewerId && <p className="text-xs text-red-500 mt-1">{errors.interviewerId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                                <Controller name="date" control={control} render={({ field }) => (
                                    <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                                <Controller name="time" control={control} render={({ field }) => (
                                    <input {...field} type="time" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                <Controller name="type" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="Video">Video Call</option>
                                        <option value="In-Person">In-Person</option>
                                        <option value="Phone">Phone</option>
                                    </select>
                                )} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <Controller name="status" control={control} render={({ field }) => (
                                    <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                )} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Link / Location</label>
                            <Controller name="meetingLink" control={control} render={({ field }) => (
                                <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. https://meet.google.com/abc-defg-hij" />
                            )} />
                        </div>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Interviews;
