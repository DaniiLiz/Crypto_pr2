import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

interface SparklineChartProps {
    data: number[];
    priceChange?: number;
    width?: number;
    height?: number;
}

export default function SparklineChart({ data, priceChange, width = 150, height = 50 }: SparklineChartProps) {
    const chartData = useMemo(() => {
        const color = priceChange && priceChange >= 0 ? '#16c784' : '#ea3943';

        return {
            labels: data.map((_, i) => i),
            datasets: [
                {
                    data,
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                },
            ],
        };
    }, [data, priceChange]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    return (
        <div style={{ width, height }}>
            <Line data={chartData} options={options} />
        </div>
    );
}