import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PerformanceGaugeChart({ telemetryData }) {
  const scores = telemetryData.map(d => d.score || 0);
  const averageScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;

  const maxScore = 100;
  const data = {
    datasets: [
      {
        data: [averageScore, maxScore - averageScore],
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(230,230,230,0.3)'],
        borderWidth: 0,
        cutout: '80%',
        rotation: 270,
        circumference: 180,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    layout: {
      padding: 0,
    },
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 150,
        height: 100,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: '150px',
          height: '250px',
          position: 'absolute',
          left: 0,
          top: -25, 
        }}
      >
        <Doughnut data={data} options={options} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
      >
        {averageScore.toFixed(1)}
      </div>
    </div>
  );
}