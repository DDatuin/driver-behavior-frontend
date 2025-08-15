
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PerformanceLineGraph({ telemetryData }) {
  const labels = telemetryData.map(d => d.datetimestamp || `#${telemetryData.indexOf(d) + 1}`);
  const scores = telemetryData.map(d => d.score || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Performance Score',
        data: scores,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.2,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { title: { display: true, text: 'Timestamp' } },
      y: { title: { display: true, text: 'Score' }, min: 0 },
    },
  };

  return <Line data={data} options={options} />;
}
