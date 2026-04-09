import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  MapPin, Navigation, Search, Zap, Clock, Star, Phone, X, Loader, 
  Wrench, ShieldAlert, CheckCircle, Info, LocateFixed 
} from 'lucide-react';
import { toast } from 'sonner';

// Leaflet loaded via CDN in index.html — declare globals
declare const L: any;

const EV_STATIONS = [
  { id: 1, name: 'Tata Power EV Hub – Andheri',    lat: 19.1136, lng: 72.8697, type: 'Fast', kw: 50,  rating: 4.8, open: '24/7',        phone: '+91-22-1234-5678', slots: 4 },
  { id: 2, name: 'Ather Grid – Bandra West',        lat: 19.0596, lng: 72.8295, type: 'Fast', kw: 30,  rating: 4.6, open: '6AM–11PM',    phone: '+91-22-2345-6789', slots: 2 },
  { id: 3, name: 'ChargeZone – Powai',              lat: 19.1177, lng: 72.9052, type: 'Ultra', kw: 120, rating: 4.9, open: '24/7',       phone: '+91-22-3456-7890', slots: 6 },
  { id: 4, name: 'EVSE India – Goregaon',           lat: 19.1539, lng: 72.8491, type: 'Slow', kw: 7.4, rating: 4.2, open: '8AM–10PM',   phone: '+91-22-4567-8901', slots: 8 },
  { id: 5, name: 'Fortum Charge – Lower Parel',     lat: 18.9948, lng: 72.8257, type: 'Fast', kw: 60,  rating: 4.7, open: '24/7',        phone: '+91-22-5678-9012', slots: 3 },
  { id: 6, name: 'Statiq – Malad West',             lat: 19.1860, lng: 72.8482, type: 'Fast', kw: 30,  rating: 4.5, open: '6AM–11PM',   phone: '+91-22-6789-0123', slots: 2 },
  { id: 7, name: 'BPCL EV Station – Vile Parle',   lat: 19.0990, lng: 72.8499, type: 'Slow', kw: 15,  rating: 4.1, open: '8AM–9PM',    phone: '+91-22-7890-1234', slots: 5 },
  { id: 8, name: 'Volvo Charge – Worli Sea Face',   lat: 18.9987, lng: 72.8178, type: 'Ultra', kw: 150, rating: 5.0, open: '24/7',      phone: '+91-22-8901-2345', slots: 8 },
  { id: 9, name: 'BluSmart Hub – Kurla',            lat: 19.0728, lng: 72.8826, type: 'Fast', kw: 50,  rating: 4.4, open: '7AM–11PM',   phone: '+91-22-9012-3456', slots: 4 },
  { id: 10,name: 'Delta Charge – Thane',            lat: 19.2183, lng: 72.9781, type: 'Fast', kw: 60,  rating: 4.6, open: '24/7',        phone: '+91-22-0123-4567', slots: 6 },
];

const TECH_HUBS = [
  { id: 101, name: 'Master Tech – Santacruz',       lat: 19.0827, lng: 72.8412, type: 'Service', rating: 4.9, open: '9AM–7PM',  phone: '+91-22-9999-0001', expertise: 'Battery Repair' },
  { id: 102, name: 'EV Solutions – Chembur',        lat: 19.0622, lng: 72.8974, type: 'Service', rating: 4.7, open: '24/7',     phone: '+91-22-9999-0002', expertise: 'Fast Fix' },
  { id: 103, name: 'Precision Motors – Juhu',       lat: 19.1025, lng: 72.8271, type: 'Service', rating: 4.8, open: '8AM–8PM',  phone: '+91-22-9999-0003', expertise: 'Diagnostics' },
  { id: 104, name: 'Elite EV Works – Dadar',        lat: 19.0178, lng: 72.8478, type: 'Service', rating: 4.6, open: '9AM–6PM',  phone: '+91-22-9999-0004', expertise: 'Full Overhaul' },
  { id: 105, name: 'Quick Charge Tech – Borivali',  lat: 19.2313, lng: 72.8522, type: 'Service', rating: 4.5, open: '10AM–9PM', phone: '+91-22-9999-0005', expertise: 'BMS Testing' },
];

const ALL_LOCS = [...EV_STATIONS, ...TECH_HUBS];

const TYPE_COLORS: Record<string, string> = { 
  Ultra: '#00d97e', 
  Fast: '#0ea5e9', 
  Slow: '#f59e0b',
  Service: '#ffcc00' 
};

// Helper: Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapPage() {
  const navigate    = useNavigate();
  const mapRef      = useRef<any>(null);
  const mapDiv      = useRef<HTMLDivElement>(null);
  const [selected,  setSelected]  = useState<any>(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState<'All' | 'Ultra' | 'Fast' | 'Slow' | 'Service'>('All');
  const [routing,   setRouting]   = useState(false);
  const [userPos,   setUserPos]   = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ dist: string; eta: string } | null>(null);
  const routeLayerRef = useRef<any>(null);
  
  // Smart Suggestion State
  const [batteryStress, setBatteryStress] = useState<string>('Normal');
  const [suggestion, setSuggestion] = useState<any>(null);

  // Load latest analysis
  useEffect(() => {
    const raw = localStorage.getItem('batteryiq_latest_analysis');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setBatteryStress(data.stress_label || 'Normal');
      } catch (e) {}
    }
  }, []);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('batteryiq_session')) navigate('/login?redirect=map');
  }, [navigate]);

  // Init map
  useEffect(() => {
    if (!mapDiv.current || mapRef.current) return;

    const map = L.map(mapDiv.current, { zoomControl: false }).setView([19.076, 72.877], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Render Markers
    ALL_LOCS.forEach(st => {
      const isService = st.type === 'Service';
      const color = TYPE_COLORS[st.type];
      const icon  = L.divIcon({
        html: `<div style="width:36px;height:36px;border-radius:50%;background:${color}33;border:2px solid ${color};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 10px ${color}44">
                 ${isService ? `<span style="color:${color};font-size:14px">🔧</span>` : `<div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>`}
               </div>`,
        className: 'marker-pulse',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      
      const marker = L.marker([st.lat, st.lng], { icon }).addTo(map);
      marker.on('click', () => {
        setSelected(st);
        map.flyTo([st.lat, st.lng], 15);
      });
    });

    // Get user location
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserPos([lat, lng]);
      
      const youIcon = L.divIcon({
        html: `<div class="relative w-6 h-6">
                <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                <div class="absolute inset-0 bg-primary border-2 border-white rounded-full shadow-lg"></div>
               </div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      
      L.marker([lat, lng], { icon: youIcon }).addTo(map).bindPopup('<b class="text-xs">Your Current Location</b>');
      map.flyTo([lat, lng], 13);
    }, () => {
      toast.error("Location access denied. Using Mumbai center.");
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Smart Suggestion Logic
  useEffect(() => {
    if (!userPos) return;

    // Calculate nearness
    const sortedStations = [...EV_STATIONS]
      .map(s => ({ ...s, dist: getDistance(userPos[0], userPos[1], s.lat, s.lng) }))
      .sort((a, b) => a.dist - b.dist);
      
    const sortedHubs = [...TECH_HUBS]
      .map(h => ({ ...h, dist: getDistance(userPos[0], userPos[1], h.lat, h.lng) }))
      .sort((a, b) => a.dist - b.dist);

    if (batteryStress === 'High') {
      setSuggestion({
        type: 'critical',
        title: 'Battery Stress High!',
        message: 'We recommend visiting a technician nearby.',
        target: sortedHubs[0]
      });
    } else {
      setSuggestion({
        type: 'info',
        title: 'Optimization Tip',
        message: 'Top-up at the nearest fast charger.',
        target: sortedStations[0]
      });
    }
  }, [userPos, batteryStress]);

  const navigateToStation = async (st: any) => {
    if (!userPos || !mapRef.current) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`,'_blank');
      return;
    }
    setRouting(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${st.lng},${st.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 'Ok') {
        const route = data.routes[0];
        const km    = (route.distance / 1000).toFixed(1);
        const mins  = Math.round(route.duration / 60);
        setRouteInfo({ dist: `${km} km`, eta: mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m` });

        if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current);
        const layer = L.geoJSON(route.geometry, { 
          style: { color: st.type === 'Service' ? '#ffcc00' : '#00d97e', weight: 5, opacity: 0.8, lineCap: 'round' } 
        }).addTo(mapRef.current);
        
        routeLayerRef.current = layer;
        mapRef.current.fitBounds(layer.getBounds(), { padding: [80, 80], animate: true });
        toast.success(`Fastest route to ${st.name} calculated!`);
      }
    } catch {
      toast.error("Failed to generate real-time route. Try again later.");
    }
    setRouting(false);
  };

  const clearRoute = () => {
    if (routeLayerRef.current && mapRef.current) mapRef.current.removeLayer(routeLayerRef.current);
    routeLayerRef.current = null;
    setRouteInfo(null);
  };

  const items = useMemo(() => {
    const list = ALL_LOCS.filter(s =>
      (filter === 'All' || s.type === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    
    if (userPos) {
      return [...list].sort((a, b) => 
        getDistance(userPos[0], userPos[1], a.lat, a.lng) - 
        getDistance(userPos[0], userPos[1], b.lat, b.lng)
      );
    }
    return list;
  }, [search, filter, userPos]);

  return (
    <Layout>
      <div className="pt-16 h-screen flex flex-col bg-background">
        
        {/* Top bar */}
        <div className="glass-strong border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center z-10">
          <div className="flex items-center gap-3 mr-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Smart Navigation</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">BatteryIQ Intelligent Routing</p>
            </div>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hubs and chargers…"
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm transition-all"
            />
          </div>

          <div className="flex gap-2">
            {(['All','Ultra','Fast','Service'] as const).map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all ${filter === t ? 'bg-primary text-primary-foreground border-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Map + sidebar */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Suggestion Banner */}
          {suggestion && (
            <div className="absolute top-4 right-4 left-4 sm:left-auto sm:w-80 z-20 animate-in slide-in-from-top-4 duration-500">
              <div className={`p-4 rounded-2xl glass-strong border ${suggestion.type === 'critical' ? 'border-red-500/30' : 'border-primary/20'} shadow-2xl`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${suggestion.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    {suggestion.type === 'critical' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{suggestion.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">{suggestion.message}</p>
                    <button 
                      onClick={() => {
                        setSelected(suggestion.target);
                        mapRef.current?.flyTo([suggestion.target.lat, suggestion.target.lng], 15);
                      }}
                      className="mt-3 text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      View Best Match <Navigation className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="hidden lg:flex flex-col w-80 glass-strong border-r border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Near Your Location</span>
              <LocateFixed className="w-3.5 h-3.5 text-primary opacity-50" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.map(st => (
                <button key={st.id} 
                  onClick={() => { setSelected(st); mapRef.current?.flyTo([st.lat, st.lng], 15); }}
                  className={`w-full p-4 border-b border-white/5 text-left transition-all hover:bg-white/5 group ${selected?.id === st.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{st.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span style={{ color: TYPE_COLORS[st.type] }} className="font-bold uppercase tracking-tighter">{st.type}</span>
                        {st.kw && <span className="text-muted-foreground">· {st.kw} kW</span>}
                        {st.dist && <span className="text-muted-foreground font-mono">· {st.dist.toFixed(1)} km away</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" /> {st.rating}</span>
                       <span className="text-[9px] text-muted-foreground">{st.slots || st.expertise}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapDiv} className="w-full h-full" />

            {/* Float HUD: Route Info */}
            {routeInfo && (
              <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 w-max px-6 py-3 glass-strong border border-primary/30 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Route</p>
                    <p className="text-lg font-black text-foreground">{routeInfo.dist} <span className="text-muted-foreground font-normal opacity-50">/</span> {routeInfo.eta}</p>
                  </div>
                </div>
                <button onClick={clearRoute} className="p-2 bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Station HUD: Quick View */}
            {selected && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm glass-strong rounded-3xl border border-white/15 shadow-2xl p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-black text-foreground tracking-tight">{selected.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: TYPE_COLORS[selected.type] + '22', color: TYPE_COLORS[selected.type] }}>
                        {selected.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {selected.open}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs font-black text-foreground mb-1">{selected.rating}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Rating</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs font-black text-primary mb-1">{selected.kw || selected.expertise}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">{selected.kw ? 'Power' : 'Expert'}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs font-black text-foreground mb-1">{selected.slots || 'Active'}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">{selected.slots ? 'Slots' : 'Status'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigateToStation(selected)}
                    disabled={routing}
                    className="flex-1 py-3.5 bg-primary text-primary-foreground text-sm font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 glow-primary disabled:opacity-50"
                  >
                    {routing ? <Loader className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                    {routing ? 'Routing...' : 'Start Navigation'}
                  </button>
                  <a href={`tel:${selected.phone}`} className="p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                    <Phone className="w-5 h-5 text-primary" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
