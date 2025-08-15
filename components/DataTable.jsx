// components/DataTable.jsx
import React from 'react';

export default function DataTable({ telemetryData }) {
  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#eee' }}>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Latitude</th>
            <th style={thStyle}>Longitude</th>
            <th style={thStyle}>Speed</th>
            <th style={thStyle}>Acceleration</th>
            <th style={thStyle}>Events</th>
          </tr>
        </thead>
        <tbody>
          {telemetryData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: 10 }}>
                No telemetry data
              </td>
            </tr>
          ) : (
            telemetryData.map((entry, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{entry.datetimestamp || 'N/A'}</td>
                <td style={tdStyle}>{entry.latitude?.toFixed(5) || 'N/A'}</td>
                <td style={tdStyle}>{entry.longitude?.toFixed(5) || 'N/A'}</td>
                <td style={tdStyle}>{entry.speed?.toFixed(5)}</td>
                <td style={tdStyle}>{entry.acceleration?.toFixed(5)}</td>
                <td style={tdStyle}>
                  {entry.events && Array.isArray(entry.events) && entry.events.length > 0
                    ? entry.events.map(e => e.type).join(', ')
                    : 'None'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '5px',
  borderBottom: '2px solid #aaa',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '5px',
  borderBottom: '1px solid #ddd',
};
