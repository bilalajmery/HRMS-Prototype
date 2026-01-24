import Chart from 'react-apexcharts';
import { CHART_COLORS } from '../../utils/constants';

const AreaChart = ({
    series,
    categories,
    colors = [CHART_COLORS.status.info, CHART_COLORS.status.success],
    height = 300,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    gradient = true,
    stacked = false,
    title,
}) => {
    const options = {
        chart: {
            type: 'area',
            fontFamily: 'Inter, system-ui, sans-serif',
            toolbar: {
                show: false,
            },
            stacked: stacked,
            zoom: {
                enabled: false,
            },
        },
        colors: colors,
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: gradient ? 'gradient' : 'solid',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        grid: {
            show: showGrid,
            borderColor: '#e2e8f0',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            categories: categories,
            labels: {
                show: showXAxis,
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: showYAxis,
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                    fontWeight: 500,
                },
                formatter: (value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value;
                },
            },
        },
        legend: {
            show: series.length > 1,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontWeight: 500,
            markers: {
                width: 10,
                height: 10,
                radius: 2,
            },
        },
        tooltip: {
            x: {
                show: true,
            },
            y: {
                formatter: (value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value;
                },
            },
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: {
                        height: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={series}
            type="area"
            height={height}
        />
    );
};

export default AreaChart;
