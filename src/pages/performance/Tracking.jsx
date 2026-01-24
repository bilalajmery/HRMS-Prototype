import { useMemo } from 'react';
import {
    HiOutlineChartBar,
    HiOutlineTrendingUp,
    HiOutlineTrendingDown,
    HiOutlineUserGroup,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import RadarChart from '../../components/charts/RadarChart';
import { CHART_COLORS } from '../../utils/constants';

const Tracking = () => {
    const { goals, employees } = useStore();

    // Mock Performance Data over time
    const performanceTrend = useMemo(() => ({
        series: [
            { name: 'Company Average', data: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8] },
            { name: 'Engineering', data: [3.5, 3.6, 3.8, 3.9, 3.9, 4.0] },
            { name: 'Sales', data: [2.8, 3.0, 3.2, 3.4, 3.6, 3.7] },
        ],
        categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    }), []);

    // Department Comparison
    const departmentScores = useMemo(() => ({
        series: [{
            name: 'Avg Rating',
            data: [4.0, 3.7, 3.5, 3.8, 3.2]
        }],
        categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
    }), []);

    // Top Performers Logic (Mock)
    const topPerformers = useMemo(() => {
        return employees.slice(0, 5).map(e => ({
            ...e,
            rating: (3.5 + Math.random() * 1.5).toFixed(1),
            trend: Math.random() > 0.5 ? 'up' : 'stable'
        })).sort((a, b) => b.rating - a.rating);
    }, [employees]);

    // Goal Completion by Department
    const goalStats = useMemo(() => ({
        series: [{
            name: 'Completed',
            data: [85, 92, 78, 88, 76]
        }, {
            name: 'In Progress',
            data: [15, 8, 22, 12, 24]
        }],
        categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
    }), []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Performance Tracking</h1>
                <p className="text-slate-500">Analytics and trends on organizational performance</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Avg Performance</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">3.8</p>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                            <HiOutlineTrendingUp className="mr-1" /> +0.2
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Goal Completion</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">82%</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <HiOutlineChartBar className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Review Participation</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">95%</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <HiOutlineUserGroup className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">High Performers</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">18%</p>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                            <HiOutlineTrendingUp className="mr-1" /> +2%
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Performance Trends</Card.Title>
                        <Card.Description>Average ratings over the last 6 months</Card.Description>
                    </Card.Header>
                    <LineChart
                        series={performanceTrend.series}
                        categories={performanceTrend.categories}
                        colors={[CHART_COLORS.primary[0], CHART_COLORS.secondary[0], CHART_COLORS.accent[0]]}
                        height={300}
                    />
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Department Scores</Card.Title>
                        <Card.Description>Current average review scores by department</Card.Description>
                    </Card.Header>
                    <RadarChart
                        series={departmentScores.series}
                        categories={departmentScores.categories}
                        colors={[CHART_COLORS.primary[5]]}
                        height={300}
                    />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Goal Stats */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <Card.Title>Goals Status by Department</Card.Title>
                    </Card.Header>
                    <BarChart
                        series={goalStats.series}
                        categories={goalStats.categories}
                        stacked={true}
                        height={300}
                        colors={[CHART_COLORS.status.success, CHART_COLORS.status.warning]}
                    />
                </Card>

                {/* Top Performers List */}
                <Card>
                    <Card.Header>
                        <Card.Title>Top Performers</Card.Title>
                        <Card.Description>Based on recent reviews</Card.Description>
                    </Card.Header>
                    <div className="space-y-4">
                        {topPerformers.map((emp, idx) => (
                            <div key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <span className={`w-6 text-center font-bold text-sm ${idx < 3 ? 'text-amber-500' : 'text-slate-400'}`}>#{idx + 1}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-slate-900">{emp.name}</p>
                                    <p className="text-xs text-slate-500">{emp.department}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{emp.rating}</p>
                                    {emp.trend === 'up' && <HiOutlineTrendingUp className="w-3 h-3 text-green-500 ml-auto" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Tracking;
