import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiOutlineUsers,
    HiOutlineFlag,
    HiOutlineChartBar,
    HiOutlineHeart,
    HiOutlineCurrencyDollar,
    HiOutlineTrendingDown,
    HiOutlineClock,
    HiOutlineAcademicCap,
    HiOutlineStar,
    HiOutlineBriefcase,
    HiOutlineUserAdd,
    HiOutlineClipboardCheck,
    HiOutlineCalendar,
    HiOutlineDownload,
    HiOutlinePlus,
    HiArrowUp,
    HiArrowDown,
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import DonutChart from '../../components/charts/DonutChart';
import AreaChart from '../../components/charts/AreaChart';
import BarChart from '../../components/charts/BarChart';
import RadarChart from '../../components/charts/RadarChart';
import { formatDate, formatRelativeTime, countBy, formatCurrency, downloadCSV, cn } from '../../utils/helpers';
import { CHART_COLORS } from '../../utils/constants';
import SEO from '../../components/common/SEO';

const Dashboard = () => {
    const navigate = useNavigate();
    const { employees, goals, candidates, interviews, posts, leaveRequests } = useStore();
    const [timeFilter, setTimeFilter] = useState('month');

    // Calculate KPIs
    const kpis = useMemo(() => {
        const activeEmployees = employees.filter((e) => e.status === 'Active').length;
        const completedGoals = goals.filter((g) => g.status === 'Completed').length;
        const totalGoals = goals.length;
        const avgPerformance = 3.8; // Mock data
        const happinessScore = 78; // Mock data

        return {
            totalWorkforce: employees.length,
            activeEmployees,
            goalCompletion: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
            completedGoals,
            totalGoals,
            avgPerformance,
            happinessScore,
        };
    }, [employees, goals]);

    // Secondary stats
    const secondaryStats = useMemo(() => {
        const departments = [...new Set(employees.map((e) => e.department))].length;
        const probation = employees.filter((e) => e.status === 'Probation').length;
        const openPositions = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected').length;

        return [
            { label: 'Avg Salary', value: '$85,420', icon: HiOutlineCurrencyDollar, color: 'text-green-600' },
            { label: 'Turnover Rate', value: '8.2%', icon: HiOutlineTrendingDown, color: 'text-amber-600' },
            { label: 'Avg Tenure', value: '2.4 yrs', icon: HiOutlineClock, color: 'text-blue-600' },
            { label: 'Training Hours', value: '1,240', icon: HiOutlineAcademicCap, color: 'text-purple-600' },
            { label: 'Recognition', value: '156', icon: HiOutlineStar, color: 'text-amber-500' },
            { label: 'Open Positions', value: String(openPositions || 8), icon: HiOutlineBriefcase, color: 'text-indigo-600' },
        ];
    }, [employees, candidates]);

    // Department distribution for donut chart
    const departmentData = useMemo(() => {
        const counts = countBy(employees, 'department');
        return {
            series: counts.map((d) => d.count),
            labels: counts.map((d) => d.name),
        };
    }, [employees]);

    // Performance data for area chart
    const performanceData = useMemo(() => ({
        series: [
            { name: 'Avg Rating', data: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8] },
            { name: 'Goals Completed', data: [12, 18, 22, 28, 35, 42] },
        ],
        categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    }), []);

    // Skills matrix for radar chart
    const skillsData = useMemo(() => ({
        series: [
            { name: 'Engineering', data: [85, 78, 92, 88, 75, 82] },
            { name: 'Sales', data: [70, 95, 68, 82, 90, 78] },
        ],
        categories: ['Technical', 'Communication', 'Leadership', 'Teamwork', 'Innovation', 'Delivery'],
    }), []);

    // Engagement pulse for line chart
    const engagementData = useMemo(() => ({
        series: [{ name: 'Sentiment Score', data: [72, 75, 73, 78, 76, 78, 82] }],
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    }), []);

    // Quick action cards
    const quickActions = useMemo(() => {
        const newHires = employees.filter((e) => {
            const joinDate = new Date(e.joinDate);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return joinDate > thirtyDaysAgo;
        }).length;

        const pendingReviews = 12; // Mock
        const todayInterviews = interviews.filter((i) => i.status === 'Scheduled').length;

        return [
            { label: 'New Hires', value: newHires || 5, icon: HiOutlineUserAdd, color: 'bg-green-500', path: '/core/employees' },
            { label: 'Pending Reviews', value: pendingReviews, icon: HiOutlineClipboardCheck, color: 'bg-amber-500', path: '/performance/appraisals' },
            { label: 'Open Positions', value: 8, icon: HiOutlineBriefcase, color: 'bg-blue-500', path: '/ats/candidates' },
            { label: 'Interviews Today', value: todayInterviews || 3, icon: HiOutlineCalendar, color: 'bg-purple-500', path: '/ats/interviews' },
        ];
    }, [employees, interviews]);

    // Recent activity
    const recentActivity = useMemo(() => {
        const activities = [
            { type: 'hire', text: 'James Brown joined as Marketing Specialist', time: '2 hours ago', icon: '👤' },
            { type: 'goal', text: 'Sarah Wilson completed Q4 Sales Target', time: '4 hours ago', icon: '🎯' },
            { type: 'review', text: 'Performance review completed for Engineering team', time: '1 day ago', icon: '📋' },
            { type: 'recognition', text: 'Mike Chen received Team Player award', time: '2 days ago', icon: '🏆' },
            { type: 'interview', text: 'Interview scheduled with Alex Johnson', time: '2 days ago', icon: '📅' },
        ];
        return activities;
    }, []);

    // Department leaderboard
    const departmentLeaderboard = useMemo(() => {
        return [
            { name: 'Engineering', completion: 92, trend: 'up' },
            { name: 'Sales', completion: 88, trend: 'up' },
            { name: 'Marketing', completion: 75, trend: 'down' },
            { name: 'HR', completion: 70, trend: 'up' },
            { name: 'Finance', completion: 65, trend: 'same' },
        ];
    }, []);

    const handleExport = () => {
        const reportData = employees.map((e) => ({
            id: e.id,
            name: e.name,
            department: e.department,
            designation: e.designation,
            status: e.status,
            joinDate: e.joinDate,
        }));
        downloadCSV(reportData, 'workforce_report');
    };

    return (
        <>
            <SEO
                title="Executive Dashboard"
                description="Real-time overview of people operations, performance metrics, and workforce analytics on HRMS Pro."
            />
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
                        <p className="text-slate-500 mt-1">Real-time overview of people operations and performance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                        </select>
                        <Button variant="secondary" icon={HiOutlineDownload} onClick={handleExport}>
                            Export Report
                        </Button>
                        <Button icon={HiOutlinePlus} onClick={() => navigate('/core/employees')}>
                            Quick Action
                        </Button>
                    </div>
                </div>

                {/* Main KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Workforce */}
                    <Card
                        hover
                        onClick={() => navigate('/core/employees')}
                        className="cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <HiOutlineUsers className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Total Workforce</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{kpis.totalWorkforce}</p>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <HiArrowUp className="w-3 h-3" />
                                {kpis.activeEmployees} active
                            </span>
                        </div>
                    </Card>

                    {/* Goal Completion */}
                    <Card
                        hover
                        onClick={() => navigate('/performance/goals')}
                        className="cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <HiOutlineFlag className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Goal Completion</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{kpis.goalCompletion}%</p>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <HiArrowUp className="w-3 h-3" />
                                {kpis.completedGoals}/{kpis.totalGoals} done
                            </span>
                        </div>
                    </Card>

                    {/* Avg Performance */}
                    <Card
                        hover
                        onClick={() => navigate('/performance/tracking')}
                        className="cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <HiOutlineChartBar className="w-6 h-6 text-purple-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Avg Performance</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{kpis.avgPerformance}</p>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <HiArrowUp className="w-3 h-3" />
                                +0.3 vs Q3
                            </span>
                        </div>
                    </Card>

                    {/* Happiness Score */}
                    <Card
                        hover
                        onClick={() => navigate('/culture/dashboard')}
                        className="cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <HiOutlineHeart className="w-6 h-6 text-pink-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Happiness Score</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{kpis.happinessScore}</p>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <HiArrowUp className="w-3 h-3" />
                                +5 pts
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {secondaryStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="p-4">
                                <div className="flex items-center gap-3">
                                    <Icon className={cn('w-5 h-5', stat.color)} />
                                    <div>
                                        <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-xs text-slate-500">{stat.label}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Workforce by Department */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Workforce by Department</Card.Title>
                            <Card.Description>Distribution across teams</Card.Description>
                        </Card.Header>
                        <DonutChart
                            series={departmentData.series}
                            labels={departmentData.labels}
                            centerLabel="Total"
                            centerValue={kpis.totalWorkforce}
                            onClick={(label) => navigate(`/core/employees?department=${label}`)}
                        />
                    </Card>

                    {/* Skills Matrix */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Skills Matrix</Card.Title>
                            <Card.Description>Department competency comparison</Card.Description>
                        </Card.Header>
                        <RadarChart
                            series={skillsData.series}
                            categories={skillsData.categories}
                        />
                    </Card>

                    {/* Performance Overview */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Performance Overview</Card.Title>
                            <Card.Description>Rating and goal trends</Card.Description>
                        </Card.Header>
                        <AreaChart
                            series={performanceData.series}
                            categories={performanceData.categories}
                            colors={[CHART_COLORS.status.info, CHART_COLORS.status.success]}
                        />
                    </Card>

                    {/* Engagement Pulse */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Engagement Pulse</Card.Title>
                            <Card.Description>Weekly sentiment score</Card.Description>
                        </Card.Header>
                        <BarChart
                            series={[{ name: 'Sentiment', data: engagementData.series[0].data }]}
                            categories={engagementData.categories}
                            colors={[CHART_COLORS.status.info]}
                            borderRadius={8}
                        />
                    </Card>
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Card
                                key={index}
                                hover
                                onClick={() => navigate(action.path)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', action.color)}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{action.value}</p>
                                        <p className="text-sm text-slate-500">{action.label}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card>
                        <Card.Header className="flex items-center justify-between">
                            <div>
                                <Card.Title>Recent Activity</Card.Title>
                                <Card.Description>Latest updates across the organization</Card.Description>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/analytics/reports')}>
                                View All
                            </Button>
                        </Card.Header>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700">{activity.text}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Department Leaderboard */}
                    <Card>
                        <Card.Header className="flex items-center justify-between">
                            <div>
                                <Card.Title>Department Performance</Card.Title>
                                <Card.Description>Goal completion by department</Card.Description>
                            </div>
                        </Card.Header>
                        <div className="space-y-4">
                            {departmentLeaderboard.map((dept, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <span className="w-6 text-center text-sm font-bold text-slate-400">#{index + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900">{dept.completion}%</span>
                                                {dept.trend === 'up' && <HiArrowUp className="w-4 h-4 text-green-500" />}
                                                {dept.trend === 'down' && <HiArrowDown className="w-4 h-4 text-red-500" />}
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                                style={{ width: `${dept.completion}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
