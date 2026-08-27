import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, Store, RefreshCw, Phone, ShieldCheck, Search, Layers, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet Default Icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Colored SVG Marker Pins
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${color};
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        border: 2.5px solid #ffffff;
      ">
        <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">${emoji}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

const farmIcon = createCustomIcon('#2563eb', '🚜');
const fertilizerIcon = createCustomIcon('#10b981', '🌱');
const protectionIcon = createCustomIcon('#eab308', '🛡️');
const labIcon = createCustomIcon('#8b5cf6', '🔬');
const equipmentIcon = createCustomIcon('#f97316', '⚙️');

// Default Center Coordinates (Hyderabad / Central Agro Belt)
const defaultCenter = [17.3850, 78.4867];

const defaultSuppliers = [
  {
    id: 1,
    name: 'Kisan Agro Seva & Fertilizer Hub',
    position: [17.3920, 78.4790],
    address: 'Plot 42, Kisan Mandi Road, Agro Zone',
    type: 'Organic & NPK Fertilizers',
    category: 'fertilizer',
    rating: 4.8,
    phone: '+91 98765 43210',
    status: 'Open Now',
    stock: ['Urea & DAP', 'Bio-Stimulants', 'Neem Cake'],
    icon: fertilizerIcon,
  },
  {
    id: 2,
    name: 'GreenGrow Bio-Pesticides & Seed Depot',
    position: [17.3780, 78.4950],
    address: '18 Green Valley, Farm Sector 4',
    type: 'Crop Protection & Micronutrients',
    category: 'protection',
    rating: 4.9,
    phone: '+91 98765 12345',
    status: 'Open Now',
    stock: ['Copper Fungicide', 'Bio-Inoculants', 'Drip Kits'],
    icon: protectionIcon,
  },
  {
    id: 3,
    name: 'National Agricultural Extension & Lab',
    position: [17.3980, 78.5020],
    address: 'Krishi Bhavan Campus, Tech Enclave',
    type: 'Soil Testing & Pathogen Diagnostics',
    category: 'lab',
    rating: 4.7,
    phone: '+91 98765 67890',
    status: 'Government Lab',
    stock: ['Soil pH Kits', 'Pathogen Analysis', 'Agro Advisories'],
    icon: labIcon,
  },
  {
    id: 4,
    name: 'HarvestPro Farm Equipment & Micronutrients',
    position: [17.3690, 78.4720],
    address: '7 Rural Highway Bypass, Market Yard',
    type: 'Machinery, Seeds & Zinc/Potash',
    category: 'equipment',
    rating: 4.6,
    phone: '+91 98765 99887',
    status: 'Open Now',
    stock: ['Micro-Sprinklers', 'Potash Sulphate', 'Hybrid Seeds'],
    icon: equipmentIcon,
  },
];

// Map Recenter Helper Component
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 13, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveLocationMap({ className = '' }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' | 'street' | 'terrain' | 'dark'
  
  const initialPosition = useMemo(() => {
    if (user?.latitude && user?.longitude && !isNaN(Number(user.latitude)) && !isNaN(Number(user.longitude))) {
      return [Number(user.latitude), Number(user.longitude)];
    }
    return defaultCenter;
  }, [user?.latitude, user?.longitude]);

  const [position, setPosition] = useState(initialPosition);
  const [userGpsAccuracy, setUserGpsAccuracy] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState(defaultSuppliers);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationStatus, setLocationStatus] = useState(user?.farmLocation ? `Farm Zone: ${user.farmLocation}` : 'Live Farm GPS');
  const [isLocating, setIsLocating] = useState(false);

  // Haversine Distance Formula in Kilometers
  const getDistanceKm = useCallback((from, to) => {
    if (!from || !to) return 0;
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(to[0] - from[0]);
    const dLng = toRad(to[1] - from[1]);
    const lat1 = toRad(from[0]);
    const lat2 = toRad(to[0]);
    const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const fetchSuppliersFromApi = useCallback(async (coords) => {
    try {
      const res = await fetch(`/api/map/suppliers?lat=${coords[0]}&lng=${coords[1]}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s) => ({
            id: s.id,
            name: s.name,
            position: [Number(s.latitude) || coords[0], Number(s.longitude) || coords[1]],
            address: s.address,
            type: s.type,
            category: s.category,
            rating: s.rating,
            phone: s.phone,
            status: s.status,
            stock: s.stock || [],
            icon: s.category === 'fertilizer' ? fertilizerIcon :
                  s.category === 'protection' ? protectionIcon :
                  s.category === 'lab' ? labIcon : equipmentIcon
          }));
          setShops(mapped);
          return;
        }
      }
    } catch (e) {
      console.warn('Using local suppliers fallback');
    }
  }, []);

  // Browser Geolocation
  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      fetchSuppliersFromApi(position);
      return;
    }

    setIsLocating(true);
    setLocationStatus('Pinpointing live farm coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setUserGpsAccuracy(pos.coords.accuracy || 30);
        setIsLocating(false);
        setLocationStatus(`Live Location Connected (±${Math.round(pos.coords.accuracy || 30)}m)`);
        fetchSuppliersFromApi(coords);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(user?.farmLocation ? `Farm: ${user.farmLocation}` : 'Regional Agro Coordinates');
        fetchSuppliersFromApi(position);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [fetchSuppliersFromApi, position, user?.farmLocation]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesCategory = filterCategory === 'all' || shop.category === filterCategory;
      const matchesSearch =
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.stock.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [shops, filterCategory, searchQuery]);

  // Tile layer configuration
  const tileConfig = useMemo(() => {
    switch (mapLayer) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri World Imagery, Maxar, Earthstar Geographics',
        };
      case 'terrain':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenTopoMap contributors',
        };
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CARTO dark matter',
        };
      case 'street':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
  }, [mapLayer]);

  return (
    <div className={`overflow-hidden rounded-[2.5rem] border border-emerald-900/15 bg-white shadow-2xl shadow-emerald-900/5 ${className}`}>
      {/* Header & Controls Bar */}
      <div className="border-b border-emerald-900/10 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25">
              <Compass className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-400/20">
                  <CheckCircle2 className="h-3 w-3" /> Live Satellite & GIS Map Engine
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200/80">
                  • {locationStatus}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Precision Geo-Location & Agro Supply Locator
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Map Layer Mode Switcher */}
            <div className="flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur-md">
              {[
                { id: 'satellite', label: '🛰️ Satellite' },
                { id: 'street', label: '🗺️ Streets' },
                { id: 'terrain', label: '⛰️ Terrain' },
                { id: 'dark', label: '🌙 Night' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setMapLayer(layer.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    mapLayer === layer.id
                      ? 'bg-emerald-400 text-slate-950 shadow-md font-black scale-[1.02]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Locate Button */}
            <button
              type="button"
              onClick={refreshLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'My Farm Location'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] min-w-0">
        
        {/* Left Column: Interactive Satellite / Street Map */}
        <div className="relative h-[480px] w-full bg-slate-950 min-w-0">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <ChangeMapView center={position} zoom={13} />
            <TileLayer
              attribution={tileConfig.attribution}
              url={tileConfig.url}
              maxZoom={19}
            />

            {/* User Live Farm Location Pin */}
            <Marker position={position} icon={farmIcon}>
              <Popup>
                <div className="p-1 text-slate-900 text-left">
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Your Live Farm Position
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1">Farm Telemetry Hub</h4>
                  <p className="text-xs text-slate-600">
                    Lat: {position[0].toFixed(4)}°, Lng: {position[1].toFixed(4)}°
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* GPS Accuracy Circle */}
            {userGpsAccuracy && (
              <Circle
                center={position}
                radius={userGpsAccuracy * 2}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              />
            )}

            {/* Supplier & Laboratory Pins */}
            {filteredShops.map((shop) => (
              <Marker
                key={shop.id}
                position={shop.position}
                icon={shop.icon}
                eventHandlers={{
                  click: () => setSelectedShop(shop),
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 text-left max-w-[240px]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-black text-emerald-800">
                        ★ {shop.rating}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        {shop.status}
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">{shop.name}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{shop.address}</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">{shop.type}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-700">
                        {getDistanceKm(position, shop.position).toFixed(1)} km away
                      </span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${shop.position[0]},${shop.position[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:underline"
                      >
                        <span>Directions</span>
                        <Navigation className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[500] hidden sm:flex items-center gap-2 rounded-2xl bg-slate-950/85 backdrop-blur-md px-3.5 py-2 text-white border border-white/15 text-[11px] font-bold shadow-xl pointer-events-none">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-400/40" /> Farm GPS
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40" /> Fertilizer
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-400/40" /> Protection
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-purple-400/40" /> Soil Lab
            </span>
          </div>
        </div>

        {/* Right Column: Suppliers List & Search */}
        <div className="flex flex-col h-[480px] bg-slate-50 border-t lg:border-t-0 lg:border-l border-emerald-900/10">
          
          {/* Filter & Search Header */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fertilizer, urea, fungicide, soil lab..."
                className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none transition"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Suppliers' },
                { id: 'fertilizer', label: '🌱 NPK Fertilizers' },
                { id: 'protection', label: '🛡️ Bio-Pesticides' },
                { id: 'lab', label: '🔬 Soil Labs' },
                { id: 'equipment', label: '🚜 Equipment' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Cards Scroll List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredShops.map((shop) => {
              const distance = getDistanceKm(position, shop.position).toFixed(1);
              const isSelected = selectedShop?.id === shop.id;

              return (
                <div
                  key={shop.id}
                  onClick={() => {
                    setSelectedShop(shop);
                    setPosition(shop.position);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{shop.name}</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                          ★ {shop.rating}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{shop.address}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-800">
                      <Navigation className="h-3 w-3" /> {distance} km
                    </span>
                  </div>

                  <p className="text-xs font-bold text-emerald-700 mt-2">{shop.type}</p>

                  {/* Stock Badges */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {shop.stock.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> {shop.phone}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shop.position[0]},${shop.position[1]}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredShops.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <Store className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-500">No agro suppliers match your filter</p>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-white border-t border-slate-200 text-center text-[10px] font-bold text-slate-500">
            Click any supplier card above to center on the map and view live driving directions.
          </div>
        </div>

      </div>
    </div>
  );
}