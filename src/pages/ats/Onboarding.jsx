import { useState } from 'react';
import {
    HiOutlineClipboardList,
    HiOutlineCheck,
    HiOutlineUserAdd,
    HiOutlineMail,
    HiOutlineBriefcase
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/helpers';

const Onboarding = () => {
    const { candidates } = useStore();

    // Tasks Mock - In a real app, this would be in the store
    const [newHires, setNewHires] = useState(
        candidates
            .filter(c => c.stage === 'Hired')
            .map(c => ({
                ...c,
                joinDate: '2024-02-01',
                progress: 25,
                tasks: [
                    { id: 1, title: 'Sign Contract', completed: true },
                    { id: 2, title: 'Upload Documents', completed: false },
                    { id: 3, title: 'IT Setup', completed: false },
                    { id: 4, title: 'Welcome Meeting', completed: false },
                ]
            }))
    );

    const toggleTask = (hireId, taskId) => {
        setNewHires(prev => prev.map(hire => {
            if (hire.id === hireId) {
                const updatedTasks = hire.tasks.map(t =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                );
                const completedCount = updatedTasks.filter(t => t.completed).length;
                const progress = Math.round((completedCount / updatedTasks.length) * 100);
                return { ...hire, tasks: updatedTasks, progress };
            }
            return hire;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Onboarding</h1>
                <p className="text-slate-500">Track task completion for new joiners</p>
            </div>

            {newHires.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineUserAdd className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No Pending Onboarding</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Candidates moved to "Hired" stage will appear here automatically.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {newHires.map(hire => (
                        <Card key={hire.id} className="flex flex-col h-full">
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <Avatar name={hire.name} size="md" />
                                    <Badge variant={hire.progress === 100 ? 'success' : 'warning'}>
                                        {hire.progress === 100 ? 'Completed' : 'In Progress'}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{hire.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{hire.role}</p>

                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <HiOutlineMail className="w-4 h-4 text-slate-400" />
                                        {hire.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HiOutlineBriefcase className="w-4 h-4 text-slate-400" />
                                        Joining: {formatDate(hire.joinDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Onboarding Checklist</span>
                                    <span className="text-xs font-bold text-blue-600">{hire.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mb-4 overflow-hidden">
                                    <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${hire.progress}%` }} />
                                </div>

                                <div className="space-y-2">
                                    {hire.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            onClick={() => toggleTask(hire.id, task.id)}
                                            className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                {task.completed && <HiOutlineCheck className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 flex gap-2">
                                <Button variant="outline" size="sm" className="w-full">Send Reminder</Button>
                                <Button size="sm" className="w-full" disabled={hire.progress < 100}>Complete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Onboarding;
