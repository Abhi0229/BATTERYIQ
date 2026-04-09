import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import { 
  MapPin, Navigation, Search, Zap, Clock, Star, Phone, X, Loader, 
  Wrench, ShieldAlert, CheckCircle, LocateFixed 
} from 'lucide-react';
import { toast } from 'sonner';

// Leaflet loaded via CDN in index.html — declare globals
declare const L: any;

const MUMBAI_CENTER: [number, number] = [19.0760, 72.8777];

const EV_STATIONS = [
  { id: 1, name: 'Tata Power EV Hub – Andheri',    lat: 19.1136, lng: 72.8697, type: 'Fast', kw: 50,  rating: 4.8, open: '24/7',        phone: '+91-22-1234-5678', slots: 4, address: 'Western Express Hwy, Andheri East' },
  { id: 2, name: 'Ather Grid – Bandra West',        lat: 19.0596, lng: 72.8295, type: 'Fast', kw: 30,  rating: 4.6, open: '6AM–11PM',    phone: '+91-22-2345-6789', slots: 2, address: 'Linking Rd, Bandra West' },
  { id: 3, name: 'ChargeZone – Powai',              lat: 19.1177, lng: 72.9052, type: 'Ultra', kw: 120, rating: 4.9, open: '24/7',       phone: '+91-22-3456-7890', slots: 6, address: 'Hiranandani Gardens, Powai' },
  { id: 4, name: 'EVSE India – Goregaon',           lat: 19.1539, lng: 72.8491, type: 'Slow', kw: 7.4, rating: 4.2, open: '8AM–10PM',   phone: '+91-22-4567-8901', slots: 8, address: 'SV Rd, Goregaon West' },
  { id: 5, name: 'Fortum Charge – Lower Parel',     lat: 18.9948, lng: 72.8257, type: 'Fast', kw: 60,  rating: 4.7, open: '24/7',        phone: '+91-22-5678-9012', slots: 3, address: 'Senapati Bapat Marg, Lower Parel' },
  { id: 6, name: 'Statiq – Malad West',             lat: 19.1860, lng: 72.8482, type: 'Fast', kw: 30,  rating: 4.5, open: '6AM–11PM',   phone: '+91-22-6789-0123', slots: 2, address: 'New Link Rd, Malad West' },
  { id: 7, name: 'BPCL EV Station – Vile Parle',   lat: 19.0990, lng: 72.8499, type: 'Slow', kw: 15,  rating: 4.1, open: '8AM–9PM',    phone: '+91-22-7890-1234', slots: 5, address: 'Nehru Rd, Vile Parle East' },
  { id: 8, name: 'Volvo Charge – Worli Sea Face',   lat: 18.9987, lng: 72.8178, type: 'Ultra', kw: 150, rating: 5.0, open: '24/7',      phone: '+91-22-8901-2345', slots: 8, address: 'Worli Sea Face, Worli' },
  { id: 9, name: 'BluSmart Hub – Kurla',            lat: 19.0728, lng: 72.8826, type: 'Fast', kw: 50,  rating: 4.4, open: '7AM–11PM',   phone: '+91-22-9012-3456', slots: 4, address: 'LBS Marg, Kurla West' },
  { id: 10,name: 'Delta Charge – Thane',            lat: 19.2183, lng: 72.9781, type: 'Fast', kw: 60,  rating: 4.6, open: '24/7',        phone: '+91-22-0123-4567', slots: 6, address: 'Ghodbunder Rd, Thane West' },
];

const TECH_HUBS = [
  { id: 101, name: 'Master Tech – Santacruz',       lat: 19.0827, lng: 72.8412, type: 'Service', rating: 4.9, open: '9AM–7PM',  phone: '+91-22-9999-0001', expertise: 'Battery Repair', address: 'Santacruz West, Mumbai' },
  { id: 102, name: 'EV Solutions – Chembur',        lat: 19.0622, lng: 72.8974, type: 'Service', rating: 4.7, open: '24/7',     phone: '+91-22-9999-0002', expertise: 'Fast Fix', address: 'Chembur East, Mumbai' },
  { id: 103, name: 'Precision Motors – Juhu',       lat: 19.1025, lng: 72.8271, type: 'Service', rating: 4.8, open: '8AM–8PM',  phone: '+91-22-9999-0003', expertise: 'Diagnostics', address: 'Juhu Scheme, Mumbai' },
  { id: 104, name: 'Elite EV Works – Dadar',        lat: 19.0178, lng: 72.8478, type: 'Service', rating: 4.6, open: '9AM–6PM',  phone: '+91-22-9999-0004', expertise: 'Full Overhaul', address: 'Gokhale Rd, Dadar' },
];

const ALL_LOCS = [...EV_STATIONS, ...TECH_HUBS];

const TYPE_COLORS: Record<string, string> = { 
  Ultra: '#00d97e', 
  Fast: '#10b981', 
  Slow: '#f59e0b',
  Service: '#fbbf24' 
};

export default function MapPage() {
  const navigate      = useNavigate();
  const mapRef        = useRef<any>(null);
  const mapDiv        = useRef<HTMLDivElement>(null);
  const sidebarRefs   = useRef<Record<number, HTMLButtonElement>>({});
  const markersRef    = useRef<Record<number, any>>({});

  const [selected,  setSelected]  = useState<any>(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState<'All' | 'Ultra' | 'Fast' | 'Slow' | 'Service'>('All');
  const [routing,   setRouting]   = useState(false);
  const [userPos,   setUserPos]   = useState<[number, number]>(MUMBAI_CENTER);
  const [routeInfo, setRouteInfo] = useState<{ dist: string; eta: string } | null>(null);
  const routeLayerRef = useRef<any>(null);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('batteryiq_session')) navigate('/login?redirect=map');
  }, [navigate]);

  // Init map
  useEffect(() => {
    if (!mapDiv.current || mapRef.current) return;

    const map = L.map(mapDiv.current, { 
      zoomControl: false, 
      scrollWheelZoom: true,
      fadeAnimation: true
    }).setView(MUMBAI_CENTER, 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial User Marker
    const youIcon = L.divIcon({
      className: 'user-location-icon',
      html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px #3b82f6"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    const userMarker = L.marker(MUMBAI_CENTER, { icon: youIcon }).addTo(map).bindPopup("<b>Target Origin Verified</b>");

    // Render Markers
    ALL_LOCS.forEach(loc => {
      const color = TYPE_COLORS[loc.type];
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color}"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
      markersRef.current[loc.id] = marker;

      const popupContent = `
        <div class="px-3 py-2 text-white min-w-[140px] text-center">
          <p class="text-[9px] font-black uppercase text-primary mb-1">${loc.type}</p>
          <h4 class="text-xs font-black truncate mb-3">${loc.name}</h4>
          <button 
            id="nav-btn-${loc.id}" 
            class="w-full py-2 bg-primary text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            🧭 Navigate
          </button>
        </div>
      `;
      marker.bindPopup(popupContent, { className: 'cyber-popup', offset: [0, -10], closeButton: false });
      marker.on('click', () => handleSelect(loc));
      
      marker.on('popupopen', () => {
        const btn = document.getElementById(`nav-btn-${loc.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            startNavigation(loc.lat, loc.lng);
            marker.closePopup();
          };
        }
      });
    });

    // Real Geolocation
    navigator.geolocation.getCurrentPosition(
      pos => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(latlng);
        userMarker.setLatLng(latlng);
        map.flyTo(latlng, 13);
      },
      () => {}, 
      { enableHighAccuracy: true }
    );

    // Initial Resize Fix
    setTimeout(() => map.invalidateSize(), 500);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const handleSelect = (loc: any) => {
    setSelected(loc);
    mapRef.current?.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 1.5 });
    
    setTimeout(() => {
      const marker = markersRef.current[loc.id];
      if (marker) marker.openPopup();
    }, 200);
    
    if (sidebarRefs.current[loc.id]) {
      sidebarRefs.current[loc.id].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  async function startNavigation(destLat: number, destLon: number) {
    if (routing) return;
    setRouting(true);
    const toastId = toast.loading("Engaging Core Navigation...");

    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
    }

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${destLon},${destLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes.length) throw new Error();

      const route = data.routes[0];
      setRouteInfo({ dist: `${(route.distance / 1000).toFixed(1)} km`, eta: `${Math.round(route.duration / 60)} mins` });

      const roadLayer = L.geoJSON(route.geometry, {
        style: { color: '#3b82f6', weight: 6, opacity: 0.9, lineCap: 'round' }
      }).addTo(mapRef.current);

      routeLayerRef.current = roadLayer;
      mapRef.current.fitBounds(roadLayer.getBounds(), { padding: [80, 80], animate: true });
      toast.success("Optimum Route Found!", { id: toastId });
    } catch (err) {
      toast.error("⚠️ Signal Lost: Route Offline.", { id: toastId });
    } finally {
      setRouting(false);
    }
  }

  const clearRoute = () => {
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setRouteInfo(null);
  };

  const filtered = useMemo(() => {
    return ALL_LOCS.filter(loc => 
      (filter === 'All' || loc.type === filter) &&
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filter]);

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white">
      <Navbar />
      
      {/* Structural Containment: Hero Area */}
      <div className="flex flex-col flex-1 pt-16 relative overflow-hidden">
        
        {/* Navigation Control Bar */}
        <div className="glass-strong border-b border-white/5 px-8 py-5 flex items-center justify-between z-40 bg-[#020617]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none">Fleet Map v2</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1.5 font-bold">Smart Positioning Active</p>
            </div>
          </div>

          <div className="flex-1 max-w-sm mx-12 relative hidden xl:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Locate Charging Infrastructure..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2">
            {(['All', 'Ultra', 'Service'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-wider ${filter === f ? 'bg-primary text-white shadow-xl shadow-primary/40' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Viewport */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Left Directory */}
          <div className="w-[340px] glass-strong border-r border-white/5 flex flex-col hidden lg:flex bg-[#020617]/50">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-secondary tracking-[0.2em]">Operational Nodes</span>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-muted-foreground">{filtered.length} total</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="space-y-2">
                {filtered.map(loc => (
                  <button
                    key={loc.id}
                    ref={el => sidebarRefs.current[loc.id] = el!}
                    onClick={() => handleSelect(loc)}
                    className={`w-full p-4 text-left rounded-2xl transition-all hover:bg-white/5 group relative overflow-hidden ${selected?.id === loc.id ? 'bg-primary/10 border border-primary/20 shadow-inner' : 'border border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`text-sm font-bold truncate transition-colors ${selected?.id === loc.id ? 'text-primary' : 'text-white/90 group-hover:text-white'}`}>{loc.name}</h4>
                      <div className="flex items-center gap-1 text-yellow-500 font-black text-[10px] bg-yellow-500/5 px-1.5 py-0.5 rounded">
                        <Star className="w-2.5 h-2.5 fill-yellow-500" /> {loc.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span style={{ color: TYPE_COLORS[loc.type] }} className="font-black uppercase tracking-widest">{loc.type}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <p className="truncate font-medium">{loc.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Surface */}
          <div className="flex-1 relative bg-[#0f172a]">
            
            {/* HUD Overlay */}
            {routeInfo && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-12 duration-700">
                <div className="flex items-center gap-10 px-10 py-6 bg-[#020617]/95 backdrop-blur-2xl border border-primary/40 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <Navigation className="w-7 h-7 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[.3em]">Trajectory Sync</p>
                      <p className="text-2xl font-black text-white leading-none tracking-tighter">
                        {routeInfo.dist} <span className="mx-3 text-white/10">|</span> {routeInfo.eta}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={clearRoute}
                    className="p-4 bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-500 rounded-2xl transition-all border border-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            <div ref={mapDiv} className="w-full h-full" id="navigation-map" />

            {/* Smart Right Panel */}
            {selected && (
              <div className="absolute top-6 bottom-6 right-6 w-[420px] z-30 animate-in slide-in-from-right-12 duration-700 hidden 2xl:block">
                <div className="h-full glass-strong border border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col bg-[#020617]/90 backdrop-blur-3xl">
                  {/* Visual Background Accents */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] -z-10" />
                  <div className="absolute top-1/2 left-0 w-48 h-48 bg-blue-500/5 blur-[100px] -z-10" />
                  
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/5 rounded-[24px] border border-white/10 shadow-lg">
                        {selected.type === 'Service' ? <Wrench className="w-8 h-8 text-yellow-500" /> : <Zap className="w-8 h-8 text-primary" />}
                      </div>
                      <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Active Node Info</span>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-4 hover:bg-white/10 rounded-full transition-all group">
                      <X className="w-6 h-6 text-white/20 group-hover:text-white" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-10">
                    <div>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                        {selected.type} Power Module
                      </span>
                      <h2 className="text-4xl font-black text-white leading-[1.1] mt-6 tracking-tight">{selected.name}</h2>
                      <div className="flex items-start gap-3 mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <p className="text-sm font-medium text-white/60 leading-relaxed">{selected.address || 'Location Coordinates Stabilized'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Performance</p>
                        <p className="text-2xl font-black text-white">{selected.kw ? `${selected.kw} kW` : 'Tech'}</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 border-l-yellow-500/20">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Network Score</p>
                        <p className="text-2xl font-black text-yellow-500">{selected.rating} ★</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-6 p-5 bg-white/2 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5"><Clock className="w-6 h-6 text-primary" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Operation Window</p>
                          <p className="text-base font-black text-white">{selected.open}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-5 bg-white/2 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5"><ShieldAlert className="w-6 h-6 text-green-500" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Live Status</p>
                          <p className="text-base font-black text-green-500">Online & Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="grid grid-cols-5 gap-4">
                      <button 
                        onClick={() => startNavigation(selected.lat, selected.lng)}
                        disabled={routing}
                        className="col-span-4 py-6 bg-primary hover:bg-primary/90 text-white font-black rounded-[28px] shadow-2xl shadow-primary/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50 text-base tracking-widest overflow-hidden relative group"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {routing ? <Loader className="w-7 h-7 animate-spin" /> : <Navigation className="w-7 h-7" />}
                        {routing ? 'SYNCING...' : 'START NAVIGATION'}
                      </button>
                      <a href={`tel:${selected.phone}`} className="flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-[28px] border border-white/10 transition-all text-primary hover:scale-105">
                        <Phone className="w-8 h-8" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatBot />

      <style>{`
        #navigation-map {
          height: 100% !important;
          width: 100% !important;
        }
        .cyber-popup .leaflet-popup-content-wrapper {
          background: rgba(2, 6, 23, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 20px;
          color: white;
          padding: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .cyber-popup .leaflet-popup-tip {
          background: rgba(2, 6, 23, 0.98);
          border: 1px solid rgba(59, 130, 246, 0.4);
        }
        .user-location-icon {
          z-index: 1000 !important;
        }
        .custom-div-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .custom-div-icon:hover {
          transform: scale(1.6);
          z-index: 1001 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}
