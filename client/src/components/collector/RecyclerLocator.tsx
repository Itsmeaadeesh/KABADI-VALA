import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { CollectorBottomNav } from './CollectorBottomNav';
import type { RecyclerFacility } from '../../types/schema';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Star,
  ShieldCheck,
  Truck,
  Phone,
  Calendar,
  CheckCircle2,
  X,
  Award,
  Sparkles,
  ArrowLeft,
  List,
  Map as MapIcon
} from 'lucide-react';

// Fix leaflet icon default asset paths in Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RecyclerLocator: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [recyclers, setRecyclers] = useState<RecyclerFacility[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [selectedFacilityForPickup, setSelectedFacilityForPickup] = useState<RecyclerFacility | null>(null);
  const [pickupDate, setPickupDate] = useState<string>('2026-09-12');
  const [pickupSlot, setPickupSlot] = useState<string>('Morning (10 AM - 1 PM)');
  const [pickupSuccess, setPickupSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService.getNearbyRecyclers({
      lat: 19.0434, // Dharavi, Mumbai collector location
      lng: 72.8550,
      maxDistance
    })
      .then((data) => setRecyclers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [maxDistance]);

  const handleRequestPickup = async () => {
    if (!selectedFacilityForPickup) return;
    try {
      await ApiService.requestPickup({
        lotId: 'lot-demo-2',
        collectorId: 'col-ramesh-1',
        recyclerId: selectedFacilityForPickup.id,
        requestedDate: pickupDate,
        scheduledTimeSlot: pickupSlot,
        notes: 'Doorstep collection requested via Kabadiwala Connect'
      });
      setPickupSuccess(true);
      setTimeout(() => {
        setPickupSuccess(false);
        setSelectedFacilityForPickup(null);
      }, 2000);
    } catch (e) {
      console.error(e);
      alert(language === 'hi' ? 'डेमो पिकअप अनुरोध दर्ज हुआ!' : language === 'mr' ? 'डेमो पिकअप विनंती नोंदवली!' : 'Pickup request submitted for demo lot!');
      setSelectedFacilityForPickup(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 sm:pb-24 pb-safe max-w-5xl mx-auto px-3 sm:px-6 sm:border-x sm:border-slate-200">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-3 sm:p-4 sticky top-14 z-30 flex items-center justify-between rounded-b-2xl shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/collector')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition touch-manipulation active:scale-95 flex-shrink-0"
            aria-label="Back to Collector Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight truncate">
              {t('locator_title')}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              {language === 'hi'
                ? 'CPCB / राज्य प्रदूषण नियंत्रण बोर्ड प्रमाणित केंद्र'
                : language === 'mr'
                ? 'CPCB / राज्य प्रदूषण नियंत्रण मंडळ मान्यताप्राप्त केंद्र'
                : 'CPCB / SPCB Authorized Facilities (Demo)'}
            </p>
          </div>
        </div>

        <span className="px-2 sm:px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold flex-shrink-0">
          {recyclers.length} {language === 'hi' ? 'केंद्र' : language === 'mr' ? 'केंद्रे' : 'Facilities'}
        </span>
      </div>

      {/* Distance & View Controls Bar */}
      <div className="p-2.5 sm:p-3 bg-white border-b border-slate-100 flex items-center justify-between gap-2">
        {/* Distance Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { label: '5 KM', val: 5 },
            { label: '10 KM', val: 10 },
            { label: '25 KM', val: 25 },
            { label: language === 'hi' ? 'सभी' : language === 'mr' ? 'सर्व' : 'All', val: 100 }
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setMaxDistance(f.val)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition border touch-manipulation ${
                maxDistance === f.val
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Mobile View Toggle: List vs Map */}
        <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex-shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 touch-manipulation ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('list_view')}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 touch-manipulation ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('interactive_map')}</span>
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Map (Shown when viewMode === 'map') */}
      {viewMode === 'map' && (
        <div className="h-64 sm:h-72 w-full bg-slate-200 relative border-b border-slate-200 animate-fade-in">
          <MapContainer
            center={[19.0760, 72.8777]}
            zoom={10}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {recyclers.map((r) => (
              <Marker
                key={r.id}
                position={[r.latitude, r.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <span className="font-bold block text-slate-900">{r.facility_name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Rating: {r.rating} / 5.0 • {r.distanceKm} km
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Recycler Cards List */}
      <div className="p-4 space-y-3.5">
        {recyclers.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-3xl p-4 border transition shadow-xs ${
              r.isBestMatch
                ? 'border-2 border-emerald-500 ring-2 ring-emerald-200 shadow-emerald-500/10'
                : 'border-slate-200'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {r.isBestMatch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                    <Award className="w-3 h-3 fill-current" />
                    {t('best_match')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {t('authorized_badge')}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                <span>{r.rating}</span>
              </div>
            </div>

            {/* Facility Name & Reg */}
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {r.facility_name}
            </h3>
            <p className="text-[11px] font-mono font-medium text-slate-500 mt-0.5">
              {r.authorization_number}
            </p>

            {/* Price Teasers */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 my-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {language === 'hi' ? 'सर्किट बोर्ड भाव' : language === 'mr' ? 'सर्किट बोर्ड दर' : 'PCB Buy Rate'}
                </span>
                <span className="font-black text-emerald-700 text-sm">₹425/kg</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {language === 'hi' ? 'तांबा केबल भाव' : language === 'mr' ? 'तांबे केबल दर' : 'Copper Cable'}
                </span>
                <span className="font-black text-emerald-700 text-sm">₹535/kg</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {language === 'hi' ? 'दूरी' : language === 'mr' ? 'अंतर' : 'Distance'}
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {r.distanceKm} {language === 'hi' ? 'किमी दूर' : language === 'mr' ? 'किमी लांब' : 'km away'}
                </span>
              </div>
            </div>

            {/* Logistics info */}
            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {r.pickup_available
                    ? (language === 'hi' ? 'मुफ्त घर से पिकअप' : language === 'mr' ? 'मोफत घरपोच पिकअप' : 'Free Doorstep Pickup')
                    : (language === 'hi' ? 'स्वयं डिलीवरी' : language === 'mr' ? 'स्वतः डिलिव्हरी' : 'Self-delivery only')}
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'hi' ? 'दायरा' : language === 'mr' ? 'कक्षा' : 'Radius'}: {r.service_radius} KM
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setSelectedFacilityForPickup(r)}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t('request_pickup')}</span>
              </button>

              <a
                href={`tel:${r.contact_phone}`}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 text-center"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('call_facility')}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pickup Request Modal */}
      {selectedFacilityForPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setSelectedFacilityForPickup(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {pickupSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'hi' ? 'पिकअप शेड्यूल हो गया!' : language === 'mr' ? 'पिकअप निश्चित झाले!' : 'Pickup Scheduled!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? `वाहन ${pickupDate} (${pickupSlot}) को आपके पते पर पहुंचेगा।`
                    : language === 'mr'
                    ? `गाडी ${pickupDate} (${pickupSlot}) रोजी आपल्या पत्त्यावर पोहोचेल.`
                    : `Driver will arrive on ${pickupDate} (${pickupSlot}).`}
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 text-center mb-1">
                  {t('request_pickup')}
                </h3>
                <p className="text-xs text-slate-500 text-center mb-4 truncate">
                  {selectedFacilityForPickup.facility_name}
                </p>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'hi' ? 'पसंदीदा तारीख' : language === 'mr' ? 'पसंतीची तारीख' : 'Preferred Date'}
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'hi' ? 'समय विंडो' : language === 'mr' ? 'वेळ' : 'Time Window'}
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option>{language === 'hi' ? 'सुबह (10 AM - 1 PM)' : language === 'mr' ? 'सकाळी (10 AM - 1 PM)' : 'Morning (10 AM - 1 PM)'}</option>
                      <option>{language === 'hi' ? 'दोपहर (2 PM - 5 PM)' : language === 'mr' ? 'दुपारी (2 PM - 5 PM)' : 'Afternoon (2 PM - 5 PM)'}</option>
                      <option>{language === 'hi' ? 'शाम (5 PM - 8 PM)' : language === 'mr' ? 'संध्याकाळी (5 PM - 8 PM)' : 'Evening (5 PM - 8 PM)'}</option>
                    </select>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                    <span className="font-bold flex items-center gap-1.5 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      {language === 'hi' ? '48 घंटे भाव गारंटी' : language === 'mr' ? '४८ तास दर हमी' : 'Guaranteed Rate Lock'}
                    </span>
                    <span>
                      {language === 'hi'
                        ? 'कांटे पर तौलने तक भाव 48 घंटे के लिए सुरक्षित रहेगा।'
                        : language === 'mr'
                        ? 'काट्यावर वजन होईपर्यंत दर ४८ तासांसाठी सुरक्षित राहील.'
                        : 'Rates locked for 48 hours until physical scale verification.'}
                    </span>
                  </div>

                  <button
                    onClick={handleRequestPickup}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 text-xs transition active:scale-95"
                  >
                    {language === 'hi' ? 'पिकअप की पुष्टि करें' : language === 'mr' ? 'पिकअप निश्चित करा' : 'Confirm Pickup Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CollectorBottomNav />
    </div>
  );
};
