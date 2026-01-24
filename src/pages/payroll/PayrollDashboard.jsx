import { useMemo } from 'react';
import {
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlineUserGroup,
    HiOutlineDocumentText,
    HiOutlineDownload
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BarChart from '../../components/charts/BarChart';
import AreaChart from '../../components/charts/AreaChart';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CHART_COLORS } from '../../utils/constants';

const PayrollDashboard = () => {
    // Mock Data
    const payrollHistory = useMemo(() => ([
        { id: 1, month: 'January 2024', employees: 142, totalAmount: 854200, status: 'Paid', date: '2024-01-31' },
        { id: 2, month: 'December 2023', employees: 140, totalAmount: 848500, status: 'Paid', date: '2023-12-31' },
        { id: 3, month: 'November 2023', employees: 138, totalAmount: 835000, status: 'Paid', date: '2023-11-30' },
    ]), []);

    const salaryTrend = useMemo(() => ({
        series: [{ name: 'Total Payroll', data: [810, 825, 835, 848, 854, 860] }],
        categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    }), []);

    const departmentCost = useMemo(() => ({
        series: [{ name: 'Cost', data: [320, 280, 150, 90, 80] }],
        categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
    }), []);

    const columns = [
        { key: 'month', header: 'Period', render: (m) => <span className="font-bold text-slate-900">{m}</span> },
        { key: 'employees', header: 'Employees' },
        { key: 'totalAmount', header: 'Total Payout', render: (amt) => formatCurrency(amt) },
        { key: 'status', header: 'Status', render: (status) => <Badge variant="success">{status}</Badge> },
        { key: 'date', header: 'Payment Date', render: (date) => formatDate(date) },
        { key: 'action', header: '', render: () => <Button size="xs" variant="ghost" icon={HiOutlineDownload}>Slip</Button> }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payroll Overview</h1>
                    <p className="text-slate-500 mt-1">Manage salaries, taxes, and payment history</p>
                </div>
                <Button icon={HiOutlineDownload}>Run Payroll Report</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Payroll Cost</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(854200)}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <HiOutlineCurrencyDollar className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Avg Salary</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(6015)}</p>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                            <HiOutlineTrendingUp className="mr-1" /> +1.2%
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Next Pay Date</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">Feb 28</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <HiOutlineDocumentText className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Employees Paid</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">142</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <HiOutlineUserGroup className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Payroll Cost Trend (in 000s)</Card.Title>
                    </Card.Header>
                    <AreaChart
                        series={salaryTrend.series}
                        categories={salaryTrend.categories}
                        height={300}
                        colors={[CHART_COLORS.status.success]}
                    />
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Cost by Department (in 000s)</Card.Title>
                    </Card.Header>
                    <BarChart
                        series={departmentCost.series}
                        categories={departmentCost.categories}
                        height={300}
                        colors={[CHART_COLORS.primary[5]]}
                        borderRadius={4}
                    />
                </Card>
            </div>

            {/* Recent Payments Table */}
            <Card>
                <Card.Header>
                    <Card.Title>Payment History</Card.Title>
                </Card.Header>
                <Table columns={columns} data={payrollHistory} />
            </Card>
        </div>
    );
};

export default PayrollDashboard;
