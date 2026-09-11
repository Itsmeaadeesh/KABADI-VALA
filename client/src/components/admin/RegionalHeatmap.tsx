import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import type { AnalyticsData } from '../../types/schema';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { MapPin, Users, Scale, Building2, Award } from 'lucide-react';

export const RegionalHeatmap: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [selectedState, setSelectedState] = useState<string>('ALL');

  useEffect(() => {
    ApiService.getAnalytics().then((res) => setData(res));
  }, []);

  if (!data) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-bold">
        Loading regional geospatial data...
      </div>
    );
  }

  const filteredRegions = data.regionalData.filter((r) => {
    if (selectedState === 'ALL') return true;
    return r.state === selectedState;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Regional E-Waste Flow & Formalization Density
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic cluster analytics across Maharashtra and national mineral hubs.
          </p>
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs font-bold">
          {['ALL', 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedState === st
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Geospatial Map */}
      <div className="h-96 w-full rounded-3xl overflow-hidden border border-slate-700 shadow-xl relative">
        <MapContainer
          center={[19.7515, 75.7139]} // Maharashtra center
          zoom={6}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredRegions.map((region, idx) => (
            <CircleMarker
              key={idx}
              center={[region.lat, region.lng]}
              radius={Math.max(12, Math.sqrt(region.volumeTonnes) * 2.8)}
              pathOptions={{
                color: region.formalizationRate > 75 ? '#8b5cf6' : '#f59e0b',
                fillColor: region.formalizationRate > 75 ? '#a855f7' : '#fbbf24',
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-1 text-xs text-slate-900">
                  <span className="font-black text-sm block">{region.region}</span>
                  <span className="text-slate-600 font-medium block">
                    {region.state}
                  </span>
                  <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between gap-3">
                      <span>Volume:</span>
                      <span className="font-bold">{region.volumeTonnes} Tonnes</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Formalized Collectors:</span>
                      <span className="font-bold">{region.collectors}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Formalization Rate:</span>
                      <span className="font-bold text-purple-700">{region.formalizationRate}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs space-y-1 text-slate-200">
          <div className="font-bold mb-1 text-[11px] uppercase tracking-wider text-slate-400">
            Cluster Intensity
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            <span>High Formalization (&gt;75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span>Moderate Formalization (&lt;75%)</span>
          </div>
        </div>
      </div>

      {/* Regional Metrics Table */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 font-bold border-b border-slate-700">
                <th className="py-3 px-4">District / Region</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Secondary Volume</th>
                <th className="py-3 px-4">Registered Collectors</th>
                <th className="py-3 px-4">Authorized Recyclers</th>
                <th className="py-3 px-4 text-right">Formalization Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 font-medium">
              {filteredRegions.map((r, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{r.region}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{r.state}</td>
                  <td className="py-3 px-4 font-black text-brand-400 text-sm">
                    {r.volumeTonnes} Tonnes
                  </td>
                  <td className="py-3 px-4 text-slate-300">{r.collectors}</td>
                  <td className="py-3 px-4 text-slate-300">{r.recyclersCount} Facilities</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full font-black text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {r.formalizationRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
