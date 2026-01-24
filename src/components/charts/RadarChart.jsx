import Chart from 'react-apexcharts';
import { CHART_COLORS } from '../../utils/constants';

const RadarChart = ({
    series,
    categories,
    colors = [CHART_COLORS.status.info, CHART_COLORS.status.success],
    height = 350,
    showMarkers = true,
    fillOpacity = 0.25,
}) => {
    const options = {
        chart: {
            type: 'radar',
            fontFamily: 'Inter, system-ui, sans-serif',
            toolbar: {
                show: false,
            },
        },
        colors: colors,
        stroke: {
            width: 2,
        },
        fill: {
            opacity: fillOpacity,
        },
        markers: {
            size: showMarkers ? 4 : 0,
            strokeWidth: 2,
            strokeColors: '#fff',
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
        },
        yaxis: {
            show: false,
        },
        legend: {
            show: series.length > 1,
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            markers: {
                width: 10,
                height: 10,
                radius: 2,
            },
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: '#e2e8f0',
                    fill: {
                        colors: ['#f8fafc', '#fff'],
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: {
                        height: 280,
                    },
                },
            },
        ],
    };

    return (
        <Chart
            options={options}
            series={series}
            type="radar"
            height={height}
        />
    );
};

export default RadarChart;
