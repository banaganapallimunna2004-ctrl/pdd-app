import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

const defaultCenter = { lat: 23.2599, lng: 77.4126 };

const buildShopMarkers = (center) => {
  const base = center || defaultCenter;
  return [
    {
      id: 1,
      name: 'GreenGrow Fertilizers',
      position: { lat: base.lat + 0.008, lng: base.lng - 0.009 },
      address: '2 Agricultural Plaza, Field District',
      type: 'Organic & NPK',
    },
    {
      id: 2,
      name: 'Harvest Supply Co.',
      position: { lat: base.lat - 0.007, lng: base.lng + 0.01 },
      address: '7 Crop Road, Farm Sector',
      type: 'Micronutrients & Soil Health',
    },
    {
      id: 3,
      name: 'FieldCare Depot',
      position: { lat: base.lat + 0.005, lng: base.lng + 0.012 },
      address: '11 Rural Market, Agro Zone',
      type: 'Fertilizer & Crop Protection',
    },
  ];
};

const LiveLocationMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries: ['places'] });
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(defaultCenter);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState(buildShopMarkers(defaultCenter));
  const [locationStatus, setLocationStatus] = useState('Awaiting location permission...');
  const [placesLoading, setPlacesLoading] = useState(false);

  const getDistanceKm = (from, to) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const lat1 = toRad(from.lat);
    const lat2 = toRad(to.lat);
    const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Refreshing location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPosition(coords);
        setLocationStatus('Showing fertilizer shops near your live location.');
      },
      () => {
        setLocationStatus('Location access denied. Showing default service area.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  if (!apiKey) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass">
        <p className="text-xl font-semibold text-white">Google Maps integration</p>
        <p className="mt-4 text-slate-300">Set <code className="rounded bg-slate-800 px-1 py-0.5">VITE_GOOGLE_MAPS_API_KEY</code> in your frontend environment to enable live map view.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass">
        <p className="text-lg font-semibold text-white">Google Maps failed to load.</p>
        <p className="mt-3 text-slate-300">Please check your API key and network connection.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass">
        <p className="text-lg font-semibold text-white">Loading map...</p>
      </div>
    );
  }

  useEffect(() => {
    if (!map || !window.google || !window.google.maps.places) return;

    setPlacesLoading(true);
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(position.lat, position.lng),
      radius: 12000,
      keyword: 'fertilizer shop',
      type: ['store'],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length) {
        setShops(
          results.slice(0, 6).map((result, index) => ({
            id: result.place_id || index,
            name: result.name,
            position: { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() },
            address: result.formatted_address || 'Unknown address',
            type: result.types?.join(', ') || 'Fertilizer store',
          }))
        );
      } else {
        setShops(buildShopMarkers(position));
      }
      setPlacesLoading(false);
    });
  }, [map, position]);

  return (
    <div className="grid gap-6 rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-4 shadow-glass lg:grid-cols-[1.4fr_0.85fr]">
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/70 shadow-glass">
        <div className="border-b border-white/10 bg-slate-900/80 px-6 py-5">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/90">Live location</p>
          <p className="mt-2 text-slate-300">{locationStatus}</p>
          {placesLoading && <p className="mt-1 text-xs text-slate-500">Searching nearby suppliers...</p>}
        </div>
        <div className="h-[420px] w-full">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={position}
            zoom={13}
            options={{ disableDefaultUI: true, zoomControl: true }}
            onLoad={(mapInstance) => setMap(mapInstance)}
            onUnmount={() => setMap(null)}
          >
            <Marker position={position} label="You" />
            {shops.map((shop) => (
              <Marker key={shop.id} position={shop.position} onClick={() => setSelectedShop(shop)} />
            ))}
            {selectedShop && (
              <InfoWindow position={selectedShop.position} onCloseClick={() => setSelectedShop(null)}>
                <div className="max-w-xs">
                  <h3 className="text-lg font-semibold">{selectedShop.name}</h3>
                  <p className="text-sm text-slate-600">{selectedShop.address}</p>
                  <p className="mt-2 text-sm text-slate-500">{selectedShop.type}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>

      <div className="space-y-4 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/90">Nearby suppliers</p>
            <p className="mt-2 text-slate-300">Select a shop for details or refresh your live location.</p>
          </div>
          <button
            type="button"
            onClick={refreshLocation}
            className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-white/10"
          >
            Refresh location
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[310px] pr-1">
          {shops.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => setSelectedShop(shop)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-left transition hover:border-cyan-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{shop.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{shop.address}</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {`${getDistanceKm(position, shop.position).toFixed(1)} km`}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{shop.type}</p>
            </button>
          ))}
          {!shops.length && !placesLoading && (
            <p className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-400">No nearby fertilizer suppliers were found. Try refreshing your location or check your API key.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLocationMap;