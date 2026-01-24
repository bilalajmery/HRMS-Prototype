import Chart from 'react-apexcharts';
import { CHART_COLORS } from '../../utils/constants';

const DonutChart = ({
    series,
    labels,
    colors = CHART_COLORS.departments,
    height = 300,
    showLabels = true,
    centerLabel,
    centerValue,
    legendPosition = 'bottom',
    onClick,
}) => {
    const options = {
        chart: {
            type: 'donut',
            fontFamily: 'Inter, system-ui, sans-serif',
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    if (onClick) {
                        onClick(labels[config.dataPointIndex], series[config.dataPointIndex]);
                    }
                },
            },
        },
        colors: colors,
        labels: labels,
        legend: {
            show: showLabels,
            position: legendPosition,
            fontSize: '13px',
            fontWeight: 500,
            markers: {
                width: 10,
                height: 10,
                radius: 2,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: !!centerLabel || !!centerValue,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            offsetY: -5,
                            formatter: () => centerLabel || '',
                        },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontWeight: 700,
                            color: '#1e293b',
                            offsetY: 5,
                            formatter: () => centerValue || series.reduce((a, b) => a + b, 0),
                        },
                        total: {
                            show: !!centerLabel,
                            label: centerLabel || 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            formatter: () => centerValue || series.reduce((a, b) => a + b, 0),
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 2,
            colors: ['#fff'],
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
            type="donut"
            height={height}
        />
    );
};

export default DonutChart;
