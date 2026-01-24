import Chart from 'react-apexcharts';
import { CHART_COLORS } from '../../utils/constants';

const LineChart = ({
    series,
    categories,
    colors = [CHART_COLORS.status.info],
    height = 300,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showMarkers = true,
    curved = true,
    annotations = [],
}) => {
    const options = {
        chart: {
            type: 'line',
            fontFamily: 'Inter, system-ui, sans-serif',
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: colors,
        stroke: {
            curve: curved ? 'smooth' : 'straight',
            width: 3,
        },
        markers: {
            size: showMarkers ? 5 : 0,
            strokeWidth: 2,
            strokeColors: '#fff',
            hover: {
                size: 7,
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
            },
        },
        annotations: {
            yaxis: annotations.map((ann) => ({
                y: ann.value,
                borderColor: ann.color || '#f59e0b',
                borderWidth: 2,
                strokeDashArray: 4,
                label: {
                    text: ann.label,
                    style: {
                        color: '#fff',
                        background: ann.color || '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 600,
                    },
                },
            })),
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
            shared: true,
            intersect: false,
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: {
                        height: 200,
                    },
                    markers: {
                        size: 3,
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={series}
            type="line"
            height={height}
        />
    );
};

export default LineChart;
