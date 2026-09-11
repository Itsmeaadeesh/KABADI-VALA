export type UserRole = 'COLLECTOR' | 'RECYCLER' | 'ADMIN';
export type Language = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language: Language;
  created_at?: string;
}

export interface CollectorProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

export interface RecyclerFacility {
  id: string;
  user_id: string;
  name: string;
  facility_name: string;
  authorization_number: string;
  authorization_status: 'AUTHORIZED' | 'PENDING' | 'SUSPENDED';
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  materials_accepted: string[] | string;
  materialsAccepted?: string[];
  rates: Record<string, number> | string;
  pickup_available: number | boolean;
  service_radius: number;
  rating: number;
  contact_phone: string;
  distanceKm?: number;
  matchScore?: number;
  isBestMatch?: boolean;
}

export interface CriticalMineral {
  name: string;
  percentage: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  name_hi: string;
  name_mr: string;
  category: string;
  subcategory: string;
  benchmark_price: number;
  unit: string;
  hazards: string;
  hazards_hi: string;
  hazards_mr: string;
  critical_minerals: string;
  criticalMinerals?: CriticalMineral[];
  typical_condition: 'INTACT' | 'DAMAGED' | 'STRIPPED';
  icon: string;
  sample_image: string;
  benchmark_rate?: number;
  trend_direction?: 'UP' | 'DOWN' | 'STABLE';
  trend_percentage?: number;
}

export interface PriceRecord {
  id: string;
  material_id: string;
  benchmark_rate: number;
  trend_direction: 'UP' | 'DOWN' | 'STABLE';
  trend_percentage: number;
  name: string;
  name_hi: string;
  name_mr: string;
  code: string;
  unit: string;
}

export type LotStatus = 
  | 'NEW'
  | 'ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'AT_RECYCLER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'LOCAL_PENDING_SYNC';

export interface Lot {
  id: string;
  code: string;
  collector_id: string;
  material_id: string;
  weight: number;
  condition: 'INTACT' | 'DAMAGED' | 'STRIPPED';
  estimated_price: number;
  final_price?: number | null;
  photo_url: string;
  ai_predicted_category?: string;
  ai_confidence?: number;
  status: LotStatus;
  recycler_id?: string | null;
  pickup_request_id?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  material_name?: string;
  material_name_hi?: string;
  material_name_mr?: string;
  material_code?: string;
  material_icon?: string;
  collector_name?: string;
  collector_phone?: string;
  collector_location?: string;
  recycler_facility_name?: string;
  timeline?: TraceabilityEvent[];
}

export interface TraceabilityEvent {
  id: string;
  lot_id: string;
  event_type: string;
  description: string;
  actor_id: string;
  actor_role: string;
  location_lat?: number;
  location_lng?: number;
  timestamp: string;
}

export interface HandoverRecord {
  id: string;
  lot_id: string;
  collector_id: string;
  recycler_id: string;
  initial_weight: number;
  verified_weight: number;
  final_price: number;
  payment_method: 'UPI' | 'CASH';
  payment_reference: string;
  verified_at?: string;
  notes?: string;
  lot_code?: string;
  material_name?: string;
  collector_name?: string;
  recycler_facility_name?: string;
}

export interface Transaction {
  id: string;
  handover_record_id: string;
  lot_id: string;
  collector_id: string;
  recycler_id: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  payment_method: string;
  reference_id: string;
  created_at: string;
  lot_code?: string;
  weight?: number;
  material_name?: string;
  material_name_hi?: string;
  material_name_mr?: string;
  material_icon?: string;
  recycler_facility_name?: string;
}

export interface SafetyGuide {
  id: string;
  title: string;
  title_hi: string;
  title_mr: string;
  description: string;
  description_hi: string;
  description_mr: string;
  type: 'DO' | 'DONT';
  icon: string;
  category: string;
}

export interface AnalyticsData {
  kpis: {
    collectorsFormalized: number;
    eWasteDivertedTonnes: number;
    verifiedTransactions: number;
    purchaseValueLakhs: number;
    authorizedRecyclersActive: number;
  };
  criticalMinerals: Array<{
    mineral: string;
    symbol: string;
    amount: number;
    unit: string;
    strategicGrade: string;
    color: string;
  }>;
  regionalData: Array<{
    region: string;
    state: string;
    lat: number;
    lng: number;
    volumeTonnes: number;
    collectors: number;
    recyclersCount: number;
    formalizationRate: number;
  }>;
  materialBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyTrends: Array<{
    month: string;
    diverted: number;
    value: number;
  }>;
  disclaimer: string;
}
