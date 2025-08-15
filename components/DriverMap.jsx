import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

const CenterMarker = () => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '55%',
      transform: 'translate(-50%, -100%)', 
      zIndex: 2,
      pointerEvents: 'none',
    }}
  >
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="8" fill="#F00" stroke="#fff" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="#fff" />
    </svg>
  </div>
);

export default function DriverMap({ telemetryData }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [116.4, 39.9],
      zoom: 12,
      interactive: false,
      attributionControl: false
    });

    mapInstance.current.on('load', () => {
      mapInstance.current.resize();
      mapInstance.current.setCenter([116.4, 39.95]);
    });

    return () => mapInstance.current?.remove();
  }, []);

  useEffect(() => {
    if (!telemetryData || telemetryData.length === 0) return;

    const lastEntry = telemetryData[telemetryData.length - 1];
    const { longitude, latitude } = lastEntry;

    if (typeof longitude === 'number' && typeof latitude === 'number') {
      mapInstance.current.setCenter([longitude, latitude]);
    }
  }, [telemetryData]);

  return (
    <div style={{ position: 'relative', width: '350px', height: '300px' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          userSelect: 'none',
        }}
      />
      <CenterMarker />
    </div>
  );
}