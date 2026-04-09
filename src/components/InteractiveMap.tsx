import { useEffect, useRef, useState } from 'react';
import { MapPin, Zap, Activity } from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Detecting location...');
  const [counts, setCounts] = useState({ charging: 0, repair: 0 });
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically if not present
    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      const L = window.L;
      if (!mapRef.current || leafletMap.current) return;

      leafletMap.current = L.map(mapRef.current).setView([19.076, 72.8777], 12); // Default Mumbai
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      markersLayer.current = L.featureGroup().addTo(leafletMap.current);

      locateUser();
    };

    const locateUser = () => {
      if (!navigator.geolocation) {
        setStatus('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          const L = window.L;
          
          if (leafletMap.current) {
            leafletMap.current.setView([lat, lon], 14);
            L.marker([lat, lon], {
              icon: L.divIcon({
                className: '',
                html: `<div class="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })
            }).addTo(leafletMap.current).bindPopup('<b>You are here</b>').openPopup();

            fetchStations(lat, lon);
          }
        },
        () => setStatus('Location access denied'),
        { enableHighAccuracy: true }
      );
    };

    const fetchStations = async (lat: number, lon: number) => {
      setStatus('Finding nearby stations...');
      const radius = 5000;
      const query = `[out:json][timeout:25];(node[amenity=charging_station](around:${radius},${lat},${lon});node[shop=car_repair](around:${radius},${lat},${lon}););out body;`;
      
      try {
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await res.json();
        const elements = data.elements || [];
        
        const L = window.L;
        let cCount = 0;
        let rCount = 0;

        elements.forEach((e: any) => {
          const isCharging = e.tags?.amenity === 'charging_station';
          if (isCharging) cCount++; else rCount++;

          const icon = L.divIcon({
            className: '',
            html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm" style="background: ${isCharging ? '#0ea5e9' : '#f59e0b'}">
              ${isCharging ? '⚡' : '🔧'}
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          L.marker([e.lat, e.lon], { icon })
            .addTo(markersLayer.current)
            .bindPopup(`<b>${e.tags?.name || (isCharging ? 'Charging Station' : 'Repair Shop')}</b><br>${e.tags?.operator || ''}`);
        });

        setCounts({ charging: cCount, repair: rCount });
        setStatus(`Found ${cCount} chargers and ${rCount} shops nearby`);
      } catch (err) {
        setStatus('Failed to fetch stations');
      }
    };

    loadLeaflet();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Chargers: {counts.charging}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Repair: {counts.repair}</span>
          </div>
        </div>
        <div className="text-[10px] text-primary font-mono animate-pulse">{status}</div>
      </div>
      <div ref={mapRef} className="flex-1 w-full bg-secondary/20" />
    </div>
  );
}
