import Chart from 'react-apexcharts';
import { CHART_COLORS } from '../../utils/constants';

const BarChart = ({
    series,
    categories,
    colors = CHART_COLORS.departments,
    height = 300,
    horizontal = false,
    stacked = false,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showLabels = false,
    borderRadius = 6,
    columnWidth = '60%',
}) => {
    const options = {
        chart: {
            type: 'bar',
            fontFamily: 'Inter, system-ui, sans-serif',
            toolbar: {
                show: false,
            },
            stacked: stacked,
        },
        colors: colors,
        plotOptions: {
            bar: {
                horizontal: horizontal,
                borderRadius: borderRadius,
                columnWidth: columnWidth,
                barHeight: '60%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: showLabels,
            formatter: (val) => val,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#64748b'],
            },
        },
        grid: {
            show: showGrid,
            borderColor: '#e2e8f0',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: horizontal,
                },
            },
            yaxis: {
                lines: {
                    show: !horizontal,
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
            y: {
                formatter: (value) => `${value}`,
            },
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: {
                        height: 250,
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '80%',
                        },
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={series}
            type="bar"
            height={height}
        />
    );
};

export default BarChart;
