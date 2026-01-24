import { useState, useMemo } from 'react';
import {
    HiOutlineDownload,
    HiOutlineDocumentReport,
    HiOutlineUserGroup,
    HiOutlineTrendingDown,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlineRefresh
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AreaChart from '../../components/charts/AreaChart';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import useStore from '../../store/useStore';
import { CHART_COLORS } from '../../utils/constants';

const Reports = () => {
    const { addToast } = useStore();
    const [dateRange, setDateRange] = useState('Last 6 Months');
    const [loading, setLoading] = useState(false);

    // Dynamic Mock Data generator based on date range
    const getDataForRange = (range) => {
        // Base data arrays
        const months6 = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
        const months12 = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

        if (range === 'Last Year') {
            return {
                categories: months12,
                headcount: [110, 112, 115, 118, 120, 122, 120, 125, 128, 135, 140, 142],
                attrition: [2.0, 1.8, 1.5, 1.2, 2.5, 2.1, 1.8, 2.0, 1.5, 1.2, 1.0, 0.8]
            };
        }
        // Default Last 6 Months
        return {
            categories: months6,
            headcount: [120, 125, 128, 135, 140, 142],
            attrition: [2.5, 2.1, 1.8, 2.0, 1.5, 1.2]
        };
    };

    const currentData = useMemo(() => getDataForRange(dateRange), [dateRange]);

    const handleRangeChange = (e) => {
        setLoading(true);
        setDateRange(e.target.value);
        // Simulate data fetch delay for realism
        setTimeout(() => {
            setLoading(false);
            addToast(`Report data updated for ${e.target.value}`, 'success');
        }, 600);
    };

    const handleExport = () => {
        addToast('Downloading PDF Report...', 'info');
        setTimeout(() => {
            addToast('Report downloaded successfully', 'success');
        }, 1500);
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            addToast('Data refreshed successfully', 'success');
        }, 800);
    };

    const headcountTrend = {
        series: [{ name: 'Total Employees', data: currentData.headcount }],
        categories: currentData.categories
    };

    const attritionRate = {
        series: [{ name: 'Attrition Rate %', data: currentData.attrition }],
        categories: currentData.categories
    };

    const demographics = {
        series: [45, 30, 15, 10],
        labels: ['Engineering', 'Sales', 'Marketing', 'Support']
    };

    const genderDistribution = {
        series: [60, 40],
        labels: ['Male', 'Female']
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1">Real-time workforce metrics and insights</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <select
                            value={dateRange}
                            onChange={handleRangeChange}
                            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none hover:border-slate-300 transition-colors"
                        >
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <Button variant="secondary" icon={HiOutlineRefresh} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button icon={HiOutlineDownload} onClick={handleExport}>
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Headcount</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold text-slate-900">142</p>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center">
                                    <HiOutlineTrendingDown className="w-3 h-3 rotate-180 mr-0.5" /> 12%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <HiOutlineUserGroup className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Active employees across all depts</p>
                </Card>

                <Card className="p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Attrition Rate</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold text-slate-900">1.2%</p>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center">
                                    <HiOutlineTrendingDown className="w-3 h-3 mr-0.5" /> 0.3%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <HiOutlineTrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Monthly turnover rate</p>
                </Card>

                <Card className="p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Avg Tenure</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold text-slate-900">2.4</p>
                                <span className="text-sm font-medium text-slate-400">Years</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <HiOutlineDocumentReport className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Average employee retention</p>
                </Card>

                <Card className="p-5 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Cost per Hire</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold text-slate-900">$4.2k</p>
                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full flex items-center">
                                    <HiOutlineTrendingDown className="w-3 h-3 rotate-180 mr-0.5" /> 5%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <HiOutlineCurrencyDollar className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Average recruitment cost</p>
                </Card>
            </div>

            {/* Main Charts */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <Card className="overflow-hidden">
                    <Card.Header className="border-b border-slate-100 p-4">
                        <div className="flex justify-between items-center">
                            <Card.Title>Headcount Growth</Card.Title>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{dateRange}</span>
                        </div>
                    </Card.Header>
                    <div className="p-2">
                        <AreaChart
                            series={headcountTrend.series}
                            categories={headcountTrend.categories}
                            colors={[CHART_COLORS.primary[0]]}
                            height={320}
                        />
                    </div>
                </Card>

                <Card className="overflow-hidden">
                    <Card.Header className="border-b border-slate-100 p-4">
                        <div className="flex justify-between items-center">
                            <Card.Title>Attrition Trend</Card.Title>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{dateRange}</span>
                        </div>
                    </Card.Header>
                    <div className="p-2">
                        <BarChart
                            series={attritionRate.series}
                            categories={attritionRate.categories}
                            colors={[CHART_COLORS.status.danger]}
                            height={320}
                            borderRadius={4}
                        />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden">
                    <Card.Header className="border-b border-slate-100 p-4">
                        <Card.Title>Department Distribution</Card.Title>
                    </Card.Header>
                    <div className="p-2">
                        <DonutChart
                            series={demographics.series}
                            labels={demographics.labels}
                            colors={CHART_COLORS.departments}
                            height={320}
                        />
                    </div>
                </Card>

                <Card className="overflow-hidden">
                    <Card.Header className="border-b border-slate-100 p-4">
                        <Card.Title>Gender Diversity</Card.Title>
                    </Card.Header>
                    <div className="p-2">
                        <DonutChart
                            series={genderDistribution.series}
                            labels={genderDistribution.labels}
                            colors={[CHART_COLORS.primary[0], CHART_COLORS.secondary[0]]}
                            height={320}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
