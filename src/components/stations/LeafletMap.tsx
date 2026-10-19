import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AREAS, DEMO_STATIONS, DemoStation, availabilityStatus } from '../../data/demoData';
import { pinMarkup } from './pin';

interface LeafletMapProps {
  stations: DemoStation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onTilesFailed: () => void;
}

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const LeafletMap: React.FC<LeafletMapProps> = ({ stations, selectedId, onSelect, onTilesFailed }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  const onFailRef = useRef(onTilesFailed);
  onSelectRef.current = onSelect;
  onFailRef.current = onTilesFailed;

  // Create the map once.
  useEffect(() => {
    if (!elRef.current) return;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomSnap: 0.5 });
    mapRef.current = map;
    map.fitBounds(L.latLngBounds(DEMO_STATIONS.map((s) => [s.lat, s.lng] as [number, number])), { padding: [56, 56], maxZoom: 14 });

    let loaded = 0, errors = 0, failed = false;
    const fail = () => {
      if (failed || loaded > 0) return;
      failed = true;
      onFailRef.current();
    };
    const tiles = L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.on('tileload', () => { loaded++; });
    tiles.on('tileerror', () => { errors++; if (loaded === 0 && errors >= 3) fail(); });
    const timer = window.setTimeout(fail, 7000);

    // Neighbourhood labels (non-interactive).
    Object.values(AREAS).forEach((a) => {
      L.marker([a.lat, a.lng], {
        interactive: false,
        keyboard: false,
        zIndexOffset: -500,
        icon: L.divIcon({ className: 'area-label-wrap', html: `<span class="area-label">${a.name}</span>`, iconSize: [0, 0] }),
      }).addTo(map);
    });

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync station pins.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    const ids = new Set(stations.map((s) => s.id));
    markers.forEach((m, id) => {
      if (!ids.has(id)) { m.remove(); markers.delete(id); }
    });
    stations.forEach((s) => {
      const icon = L.divIcon({
        className: 'ev-pin-wrap',
        html: pinMarkup(availabilityStatus(s), s.id === selectedId),
        iconSize: [40, 48],
        iconAnchor: [20, 46],
      });
      let m = markers.get(s.id);
      if (!m) {
        m = L.marker([s.lat, s.lng], { icon, title: `${s.name}, ${AREAS[s.area].name}`, keyboard: true }).addTo(map);
        m.on('click', () => onSelectRef.current(s.id));
        markers.set(s.id, m);
      } else {
        m.setIcon(icon);
      }
      m.setZIndexOffset(s.id === selectedId ? 1000 : 0);
    });
  }, [stations, selectedId]);

  // Pan to the selected station.
  useEffect(() => {
    const s = DEMO_STATIONS.find((x) => x.id === selectedId);
    if (s && mapRef.current) mapRef.current.panTo([s.lat, s.lng], { animate: true, duration: 0.4 });
  }, [selectedId]);

  return <div ref={elRef} className="station-leaflet h-full w-full" role="application" aria-label="Map of demo charging stations in Hyderabad" />;
};
