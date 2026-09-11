CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('COLLECTOR', 'RECYCLER', 'ADMIN')) NOT NULL,
  language TEXT DEFAULT 'hi',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collectors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS recyclers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  authorization_number TEXT NOT NULL,
  authorization_status TEXT CHECK(authorization_status IN ('AUTHORIZED', 'PENDING', 'SUSPENDED')) DEFAULT 'AUTHORIZED',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  materials_accepted TEXT NOT NULL, -- JSON array of material codes
  rates TEXT NOT NULL,             -- JSON key-value of materialId to offered rate
  pickup_available INTEGER DEFAULT 1,
  service_radius REAL DEFAULT 25.0,
  rating REAL DEFAULT 4.8,
  contact_phone TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  benchmark_price REAL NOT NULL,
  unit TEXT DEFAULT 'KG',
  hazards TEXT NOT NULL,
  hazards_hi TEXT NOT NULL,
  hazards_mr TEXT NOT NULL,
  critical_minerals TEXT NOT NULL, -- JSON array of minerals with concentration
  typical_condition TEXT DEFAULT 'INTACT',
  icon TEXT NOT NULL,
  sample_image TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY,
  material_id TEXT UNIQUE NOT NULL,
  benchmark_rate REAL NOT NULL,
  trend_direction TEXT CHECK(trend_direction IN ('UP', 'DOWN', 'STABLE')) DEFAULT 'STABLE',
  trend_percentage REAL DEFAULT 0.0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);

CREATE TABLE IF NOT EXISTS price_history (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  date TEXT NOT NULL,
  rate REAL NOT NULL,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);

CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  collector_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  weight REAL NOT NULL,
  condition TEXT CHECK(condition IN ('INTACT', 'DAMAGED', 'STRIPPED')) DEFAULT 'INTACT',
  estimated_price REAL NOT NULL,
  final_price REAL,
  photo_url TEXT,
  ai_predicted_category TEXT,
  ai_confidence REAL,
  status TEXT CHECK(status IN ('NEW', 'ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'AT_RECYCLER', 'COMPLETED', 'CANCELLED')) DEFAULT 'NEW',
  recycler_id TEXT,
  pickup_request_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collector_id) REFERENCES collectors(id),
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (recycler_id) REFERENCES recyclers(id)
);

CREATE TABLE IF NOT EXISTS pickup_requests (
  id TEXT PRIMARY KEY,
  lot_id TEXT NOT NULL,
  collector_id TEXT NOT NULL,
  recycler_id TEXT NOT NULL,
  requested_date TEXT NOT NULL,
  scheduled_time_slot TEXT NOT NULL,
  status TEXT CHECK(status IN ('REQUESTED', 'ACCEPTED', 'SCHEDULED', 'PICKED_UP', 'COMPLETED', 'CANCELLED')) DEFAULT 'REQUESTED',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (collector_id) REFERENCES collectors(id),
  FOREIGN KEY (recycler_id) REFERENCES recyclers(id)
);

CREATE TABLE IF NOT EXISTS handover_records (
  id TEXT PRIMARY KEY,
  lot_id TEXT NOT NULL,
  collector_id TEXT NOT NULL,
  recycler_id TEXT NOT NULL,
  initial_weight REAL NOT NULL,
  verified_weight REAL NOT NULL,
  final_price REAL NOT NULL,
  payment_method TEXT CHECK(payment_method IN ('UPI', 'CASH')) DEFAULT 'UPI',
  payment_reference TEXT,
  verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (collector_id) REFERENCES collectors(id),
  FOREIGN KEY (recycler_id) REFERENCES recyclers(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  handover_record_id TEXT,
  lot_id TEXT NOT NULL,
  collector_id TEXT NOT NULL,
  recycler_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT CHECK(status IN ('PAID', 'PENDING')) DEFAULT 'PAID',
  payment_method TEXT DEFAULT 'UPI',
  reference_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (handover_record_id) REFERENCES handover_records(id),
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (collector_id) REFERENCES collectors(id),
  FOREIGN KEY (recycler_id) REFERENCES recyclers(id)
);

CREATE TABLE IF NOT EXISTS traceability_events (
  id TEXT PRIMARY KEY,
  lot_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  location_lat REAL,
  location_lng REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id)
);

CREATE TABLE IF NOT EXISTS safety_guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  title_mr TEXT NOT NULL,
  description TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  description_mr TEXT NOT NULL,
  type TEXT CHECK(type IN ('DO', 'DONT')) NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL
);
