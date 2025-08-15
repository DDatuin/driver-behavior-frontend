import { useEffect, useState, useRef } from "react";
import DriverMap from '../components/DriverMap';
import DataTable from '../components/DataTable';
import PerformanceGauge from '../components/PerformanceGaugeChart';
import PerformanceLineChart from '../components/PerformanceLineGraph';
import EventsBarChart from '../components/EventsBarGraph';

export default function Dashboard() {
  const [allTelemetryData, setAllTelemetryData] = useState([]);
  const [error, setError] = useState(null);
  const hasLoggedError = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch('http://127.0.0.1:8000/api/outputdata_send');
        if (!result.ok) {
          throw new Error(`HTTP error! status: ${result.status}`);
        }
        const json_results = await result.json();

        const telemetryArray = Array.isArray(json_results) ? json_results : [json_results];

        const telemetryWithScores = telemetryArray.map(d => {
          if (!Array.isArray(d.events)) {
            return { ...d, score: 100 };
          }

          const hasOverspeeding = d.events.some(e => e.type === 'overspeeding');
          const hasHarshBraking = d.events.some(e => e.type === 'harsh braking');
          const hasSuddenAcceleration = d.events.some(e => e.type === 'sudden acceleration');
          const hasExcessiveIdling = d.events.some(e => e.type === 'excessive idling');

          const score = 100 - (
            (hasOverspeeding ? 1 : 0) * 40 +
            (hasHarshBraking ? 1 : 0) * 30 +
            (hasSuddenAcceleration ? 1 : 0) * 20 +
            (hasExcessiveIdling ? 1 : 0) * 10
          );

          return { ...d, score };
        });

        setAllTelemetryData(prev => {
          const existingTimestamps = new Set(prev.map(d => d.datetimestamp));
          const newData = telemetryWithScores.filter(d => !existingTimestamps.has(d.datetimestamp));
          return [...prev, ...newData];
        });

        setError(null);
        hasLoggedError.current = false;
      } catch (err) {
        if (!hasLoggedError.current) {
          console.error('Failed to fetch telemetry data:', err);
          hasLoggedError.current = true;
          setError('Unable to fetch telemetry data. Backend might be offline.');
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      <h1 className="text-4xl font-extrabold mb-8">Driver Telemetry Dashboard</h1>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Average Performance</h2>
          <PerformanceGauge telemetryData={allTelemetryData} />
        </section>

        <section className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Events Summary</h2>
          <EventsBarChart telemetryData={allTelemetryData} />
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
          <PerformanceLineChart telemetryData={allTelemetryData} />
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <section className="col-span-1 md:col-span-2 bg-white p-6 rounded shadow overflow-auto max-h-[420px]">
          <h2 className="text-xl font-semibold mb-4">Telemetry Data Log</h2>
          <DataTable telemetryData={allTelemetryData} />
        </section>

        <section className="col-span-1 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Driver Location Map</h2>
          <DriverMap telemetryData={allTelemetryData} />
        </section>
      </div>
    </div>
  );
}
