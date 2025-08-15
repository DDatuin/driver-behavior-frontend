import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EventsBarGraph({ telemetryData }) {

  const allEventTypes = ['overspeeding', 'harsh braking', 'sudden acceleration', 'excessive idling'];
  
  const eventCounts = allEventTypes.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  telemetryData.forEach(curr => {
    if (curr.events && Array.isArray(curr.events)) {
      curr.events.forEach(({ type }) => {
        if (eventCounts.hasOwnProperty(type)) {
          eventCounts[type] += 1;
        }
      });
    }
  });

  const data = {
    labels: allEventTypes,
    datasets: [
      {
        label: 'Event Count',
        data: allEventTypes.map(type => eventCounts[type]),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return <Bar data={data} options={options} />;
}
