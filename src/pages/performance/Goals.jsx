import { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    HiOutlineFlag,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineFilter,
    HiOutlineChartPie,
    HiOutlinePuzzle,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Drawer from '../../components/common/Drawer';
import Avatar from '../../components/common/Avatar';
import { cn, formatDate } from '../../utils/helpers';
import { GOAL_CATEGORIES, GOAL_STATUSES } from '../../utils/constants';

// Schema
const goalSchema = z.object({
    title: z.string().min(1, 'Goal Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    ownerId: z.string().min(1, 'Owner is required'), // Maps to Employee ID
    dueDate: z.string().min(1, 'Due Date is required'),
    keyResults: z.array(z.object({
        value: z.string().min(1, 'Key result description is required')
    })).min(1, 'At least one Key Result is required'),
});

const Goals = () => {
    const { goals, employees, addGoal, updateGoal, deleteGoal, updateGoalProgress, user } = useStore();
    const [filterCategory, setFilterCategory] = useState('All');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('view');
    const [selectedGoal, setSelectedGoal] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            title: '',
            description: '',
            category: 'Individual',
            ownerId: '',
            dueDate: '',
            keyResults: [{ value: '' }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'keyResults'
    });

    // Filter Goals
    const filteredGoals = useMemo(() => {
        if (filterCategory === 'All') return goals;
        return goals.filter(g => g.category === filterCategory);
    }, [goals, filterCategory]);

    // Statistics
    const stats = useMemo(() => {
        const total = goals.length;
        const completed = goals.filter(g => g.status === 'Completed').length;
        const inProgress = goals.filter(g => g.status === 'In Progress').length;
        const overdue = goals.filter(g => g.status === 'Overdue').length;

        return { total, completed, inProgress, overdue };
    }, [goals]);

    // Handlers
    const handleOpenDrawer = (mode, goal = null) => {
        setDrawerMode(mode);
        setSelectedGoal(goal);

        if (mode === 'add') {
            reset({
                title: '',
                description: '',
                category: 'Individual',
                ownerId: '', // Default to current user or empty
                dueDate: '',
                keyResults: [{ value: '' }]
            });
        } else if (goal) {
            reset({
                title: goal.title,
                description: goal.description,
                category: goal.category,
                ownerId: goal.ownerId,
                dueDate: goal.dueDate,
                keyResults: goal.keyResults.map(kr => ({ value: kr })),
            });
        }
        setDrawerOpen(true);
    };

    const onSubmit = (data) => {
        const employee = employees.find(e => e.id === data.ownerId);
        const goalData = {
            ...data,
            owner: employee?.name || 'Unknown',
            progress: drawerMode === 'add' ? 0 : selectedGoal?.progress,
            status: drawerMode === 'add' ? 'In Progress' : selectedGoal?.status,
            keyResults: data.keyResults.map(k => k.value),
        };

        if (drawerMode === 'add') {
            addGoal(goalData);
        } else if (drawerMode === 'edit' && selectedGoal) {
            updateGoal(selectedGoal.id, goalData);
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedGoal && window.confirm('Delete this goal permanently?')) {
            deleteGoal(selectedGoal.id);
            setDrawerOpen(false);
        }
    };

    const handleProgressChange = (val) => {
        if (selectedGoal) {
            updateGoalProgress(selectedGoal.id, parseInt(val));
            setSelectedGoal(prev => ({ ...prev, progress: parseInt(val) }));
        }
    };

    const renderProgressColor = (progress) => {
        if (progress >= 100) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        return 'bg-amber-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Goal Management</h1>
                    <p className="text-slate-500 mt-1">Set and track individual and team objectives</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Categories</option>
                        {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Button icon={HiOutlinePlus} onClick={() => handleOpenDrawer('add')}>
                        New Goal
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Goals</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                        </div>
                        <HiOutlineFlag className="w-6 h-6 text-blue-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-white border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Completed</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.completed}</p>
                        </div>
                        <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-white border-l-4 border-amber-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">In Progress</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.inProgress}</p>
                        </div>
                        <HiOutlineChartPie className="w-6 h-6 text-amber-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-white border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Overdue</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.overdue}</p>
                        </div>
                        <HiOutlinePuzzle className="w-6 h-6 text-red-500" />
                    </div>
                </Card>
            </div>

            {/* Goal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGoals.map((goal) => (
                    <Card key={goal.id} className="group relative overflow-hidden flex flex-col h-full">
                        <div className={`absolute top-0 left-0 w-1 h-full ${goal.status === 'Completed' ? 'bg-green-500' : goal.status === 'Overdue' ? 'bg-red-500' : 'bg-blue-500'}`} />

                        <div className="p-5 flex-1 start">
                            <div className="flex justify-between items-start mb-3">
                                <Badge variant={goal.status === 'Completed' ? 'success' : goal.status === 'Overdue' ? 'danger' : 'warning'}>
                                    {goal.category}
                                </Badge>
                                {drawerMode !== 'add' && (
                                    <button
                                        onClick={() => handleOpenDrawer('view', goal)}
                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <h3 className="text-md font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                                {goal.title}
                            </h3>

                            <div className="flex items-center gap-3 mb-4">
                                <Avatar name={goal.owner} size="sm" />
                                <div className="text-xs text-slate-500">
                                    <p className="font-medium text-slate-700">{goal.owner}</p>
                                    <p>Due: {formatDate(goal.dueDate)}</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className={cn(
                                        goal.progress === 100 ? 'text-green-600' : 'text-slate-600'
                                    )}>{goal.progress}% Completed</span>
                                    <span className="text-slate-400">{goal.status}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${renderProgressColor(goal.progress)}`}
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
                            <button
                                onClick={() => handleOpenDrawer('view', goal)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                View Details
                            </button>
                            {goal.status !== 'Completed' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateGoalProgress(goal.id, Math.min(goal.progress + 10, 100));
                                    }}
                                    className="text-xs font-medium text-slate-500 hover:text-green-600 transition-colors"
                                >
                                    +10% Progress
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'add' ? 'Create New Goal' : drawerMode === 'edit' ? 'Edit Goal' : 'Goal Details'}
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
                                {drawerMode === 'add' ? 'Create Goal' : 'Save Changes'}
                            </Button>
                        </div>
                    )
                }
            >
                {drawerMode === 'view' && selectedGoal ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedGoal.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{selectedGoal.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Category</label>
                                <p className="text-sm font-medium text-slate-900 mt-1">{selectedGoal.category}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Due Date</label>
                                <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(selectedGoal.dueDate)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Assigned To</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Avatar name={selectedGoal.owner} size="xs" />
                                    <p className="text-sm font-medium text-slate-900">{selectedGoal.owner}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Status</label>
                                <div className="mt-1"><Badge>{selectedGoal.status}</Badge></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-900">Progress Tracking</label>
                                <span className="text-sm font-bold text-blue-600">{selectedGoal.progress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={selectedGoal.progress}
                                onChange={(e) => handleProgressChange(e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-3">Key Results</h4>
                            <ul className="space-y-3">
                                {selectedGoal.keyResults.map((kr, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                                            {selectedGoal.progress >= 100 && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                                        </div>
                                        {kr}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Comments Section Placeholder */}
                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-3">Update Feed</h4>
                            <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <p className="text-xs text-slate-500">No updates yet on this goal.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Goal Title <span className="text-red-500">*</span></label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Increase revenue by 20%" />
                                )}
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea {...field} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Details about this goal..." />
                                )}
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Owner</label>
                                <Controller
                                    name="ownerId"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                            <option value="">Select Employee</option>
                                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </select>
                                    )}
                                />
                                {errors.ownerId && <p className="mt-1 text-xs text-red-500">{errors.ownerId.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                )}
                            />
                            {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">Key Results</label>
                                <button
                                    type="button"
                                    onClick={() => append({ value: '' })}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <HiOutlinePlus className="w-3 h-3" /> Add KR
                                </button>
                            </div>
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <Controller
                                            name={`keyResults.${index}.value`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Key Result #${index + 1}`}
                                                />
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.keyResults && <p className="mt-1 text-xs text-red-500">At least one Key Result is required</p>}
                        </div>
                    </form>
                )}
            </Drawer>
        </div>
    );
};

export default Goals;
