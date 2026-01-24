import { useMemo } from 'react';
import {
    HiOutlineHeart,
    HiOutlineEmojiHappy,
    HiOutlineSparkles,
    HiOutlineChatAlt,
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import { CHART_COLORS } from '../../utils/constants';

const CultureDashboard = () => {
    // Mock Data
    const eNPSData = useMemo(() => ({
        series: [{ name: 'eNPS', data: [42, 45, 48, 44, 52, 58] }],
        categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    }), []);

    const moodData = useMemo(() => ({
        series: [65, 25, 10],
        labels: ['Happy', 'Neutral', 'Unhappy']
    }), []);

    const participationData = useMemo(() => ({
        series: [{ name: 'Survey Completion', data: [78, 85, 82, 90, 88] }],
        categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
    }), []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Culture Dashboard</h1>
                <p className="text-slate-500">Employee sentiment and engagement analytics</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Happiness Score</p>
                            <p className="text-3xl font-bold mt-1">78/100</p>
                        </div>
                        <HiOutlineEmojiHappy className="w-8 h-8 text-white/80" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">eNPS</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">+58</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <HiOutlineHeart className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Recognition</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">156</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <HiOutlineSparkles className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Feedback Rate</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">92%</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <HiOutlineChatAlt className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Employee Net Promoter Score (eNPS)</Card.Title>
                        <Card.Description>Trend over the last 6 months</Card.Description>
                    </Card.Header>
                    <LineChart
                        series={eNPSData.series}
                        categories={eNPSData.categories}
                        colors={[CHART_COLORS.secondary[5]]}
                        height={300}
                    />
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Daily Mood Pulse</Card.Title>
                        <Card.Description>Today's employee sentiment check-in</Card.Description>
                    </Card.Header>
                    <div className="flex items-center justify-center p-4">
                        <DonutChart
                            series={moodData.series}
                            labels={moodData.labels}
                            colors={[CHART_COLORS.status.success, CHART_COLORS.status.warning, CHART_COLORS.status.danger]}
                            height={300}
                            centerLabel="Respondents"
                            centerValue="142"
                        />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <Card.Title>Survey Participation by Department</Card.Title>
                    </Card.Header>
                    <BarChart
                        series={participationData.series}
                        categories={participationData.categories}
                        height={300}
                        colors={[CHART_COLORS.primary[5]]}
                    />
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Recent Feedback</Card.Title>
                    </Card.Header>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Anonymous</span>
                                    <span className="text-xs text-slate-400">2h ago</span>
                                </div>
                                <p className="text-sm text-slate-700">"The new remote work policy is really helpful. Team morale is definitely up this week!"</p>
                            </div>
                        ))}
                        <button className="w-full text-center text-sm text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
                            View All Feedback
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CultureDashboard;
