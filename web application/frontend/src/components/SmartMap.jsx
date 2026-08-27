import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const locations = [
  { id: 1, name: 'Omega Farm', position: [34.0522, -118.2437], status: 'Healthy' },
  { id: 2, name: 'Harvest Hub', position: [33.9416, -118.4085], status: 'Alert' },
  { id: 3, name: 'AgriTech Zone', position: [34.1478, -118.1445], status: 'Monitoring' },
];

const SmartMap = () => {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
      <div className="mb-5 flex items-center justify-between text-slate-100">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700/80">Farm Map</p>
          <h2 className="text-2xl font-semibold">Live location intelligence</h2>
        </div>
      </div>
      <MapContainer center={[34.05, -118.25]} zoom={10} scrollWheelZoom={false} className="h-[420px] w-full rounded-3xl border border-slate-200 shadow-2xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location.id} position={location.position}>
            <Popup>
              <div className="space-y-1">
                <strong>{location.name}</strong>
                <p>Status: {location.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {locations.map((location) => (
          <CircleMarker
            key={`circle-${location.id}`}
            center={location.position}
            radius={18}
            pathOptions={{ color: location.status === 'Alert' ? '#fb7185' : '#38bdf8', fillOpacity: 0.16 }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default SmartMap;
