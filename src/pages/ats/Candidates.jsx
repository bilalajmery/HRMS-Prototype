import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineUserGroup,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlineFilter,
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineBriefcase,
    HiArrowRight,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Drawer from '../../components/common/Drawer';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';
import { CANDIDATE_STAGES } from '../../utils/constants';

// Schema
const candidateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
    stage: z.string().min(1, 'Stage is required'),
    phone: z.string().optional(),
    experience: z.string().optional(),
});

const Candidates = () => {
    const { candidates, addCandidate, updateCandidate, deleteCandidate } = useStore();
    const [stageFilter, setStageFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            name: '',
            email: '',
            role: '',
            stage: 'Applied',
            phone: '',
            experience: ''
        },
    });

    // Filter
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStage = stageFilter === 'All' || c.stage === stageFilter;
            return matchesSearch && matchesStage;
        });
    }, [candidates, searchQuery, stageFilter]);

    // Kanban Columns
    const columns = useMemo(() => {
        if (stageFilter !== 'All') return [stageFilter];
        return CANDIDATE_STAGES;
    }, [stageFilter]);

    // Handlers
    const handleOpenDrawer = (mode, candidate = null) => {
        setDrawerMode(mode);
        setSelectedCandidate(candidate);
        if (mode === 'add') {
            reset({ name: '', email: '', role: '', stage: 'Applied', phone: '', experience: '' });
        } else if (candidate) {
            reset({ name: candidate.name, email: candidate.email, role: candidate.role, stage: candidate.stage, phone: candidate.phone, experience: candidate.experience });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const candidateData = {
            ...data,
            appliedDate: drawerMode === 'add' ? new Date().toISOString() : selectedCandidate.appliedDate,
        };

        if (drawerMode === 'add') {
            addCandidate(candidateData);
        } else if (drawerMode === 'edit' && selectedCandidate) {
            updateCandidate(selectedCandidate.id, candidateData);
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedCandidate && window.confirm('Remove candidate?')) {
            deleteCandidate(selectedCandidate.id);
            setDrawerOpen(false);
        }
    };

    const advanceStage = (candidate) => {
        const currentIndex = CANDIDATE_STAGES.indexOf(candidate.stage);
        if (currentIndex < CANDIDATE_STAGES.length - 1) {
            updateCandidate(candidate.id, { stage: CANDIDATE_STAGES[currentIndex + 1] });
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
                    <p className="text-slate-500 mt-1">Track applicants through the hiring pipeline</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search candidates..."
                        />
                    </div>
                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                    >
                        <option value="All">All Stages</option>
                        {CANDIDATE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>Add Candidate</Button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-max">
                    {columns.map(stage => {
                        const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
                        return (
                            <div key={stage} className="w-80 flex flex-col bg-slate-100 rounded-xl p-3 h-full">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{stage}</h3>
                                    <span className="bg-white text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{stageCandidates.length}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {stageCandidates.map(candidate => (
                                        <Card
                                            key={candidate.id}
                                            className="p-3 cursor-pointer hover:shadow-md transition-shadow group relative"
                                            onClick={() => handleOpenDrawer('view', candidate)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar name={candidate.name} size="xs" />
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900">{candidate.name}</p>
                                                        <p className="text-xs text-slate-500">{candidate.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
                                                <HiOutlineBriefcase className="w-3 h-3" />
                                                {candidate.experience || 'N/A'} exp
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                                <span className="text-xs text-slate-400">{formatDate(candidate.appliedDate)}</span>
                                                {stage !== 'Hired' && stage !== 'Rejected' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            advanceStage(candidate);
                                                        }}
                                                        className="w-6 h-6 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors tooltip"
                                                        title="Advance to next stage"
                                                    >
                                                        <HiArrowRight className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Add Candidate' : drawerMode === 'edit' ? 'Edit Candidate' : 'Candidate Profile'}
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
                            <Button onClick={handleSubmit(onSubmit)}>{drawerMode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedCandidate ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <Avatar name={selectedCandidate.name} size="2xl" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                                <p className="text-slate-500">{selectedCandidate.role}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge>{selectedCandidate.stage}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-700">
                                <HiOutlineMail className="w-5 h-5 text-slate-400" />
                                <span>{selectedCandidate.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <HiOutlinePhone className="w-5 h-5 text-slate-400" />
                                <span>{selectedCandidate.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <HiOutlineBriefcase className="w-5 h-5 text-slate-400" />
                                <span>{selectedCandidate.experience || '0'} years experience</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900 text-sm mb-3">Interview History</h4>
                            <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400">No interviews scheduled yet.</p>
                                <Button variant="link" size="sm" className="mt-1">Schedule Interview</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                            <Controller name="name" control={control} render={({ field }) => (
                                <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="John Doe" />
                            )} />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                                <Controller name="email" control={control} render={({ field }) => (
                                    <input {...field} type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="john@example.com" />
                                )} />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                <Controller name="phone" control={control} render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="+1 234 567 890" />
                                )} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Role Applied For <span className="text-red-500">*</span></label>
                                <Controller name="role" control={control} render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Frontend Dev" />
                                )} />
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Experience (Years)</label>
                                <Controller name="experience" control={control} render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. 5" />
                                )} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Stage</label>
                            <Controller name="stage" control={control} render={({ field }) => (
                                <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                    {CANDIDATE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            )} />
                        </div>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Candidates;
