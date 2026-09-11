import { db, initDatabase } from './database.js';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  initDatabase();

  console.log('🌱 Starting realistic database seed for Kabadiwala Connect (SIH 26229)...');

  // Clear existing records to ensure clean deterministic state
  db.exec(`
    DELETE FROM traceability_events;
    DELETE FROM transactions;
    DELETE FROM handover_records;
    DELETE FROM pickup_requests;
    DELETE FROM lots;
    DELETE FROM price_history;
    DELETE FROM prices;
    DELETE FROM materials;
    DELETE FROM recyclers;
    DELETE FROM collectors;
    DELETE FROM safety_guides;
    DELETE FROM users;
  `);

  // 1. USERS
  const collectorUserId = 'usr-collector-1';
  const recyclerUserId = 'usr-recycler-1';
  const adminUserId = 'usr-admin-1';

  const insertUser = db.prepare(`
    INSERT INTO users (id, phone, name, role, language)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run(collectorUserId, '9999999999', 'Ramesh Kumar (कबाड़ीवाला)', 'COLLECTOR', 'hi');
  insertUser.run(recyclerUserId, '8888888888', 'Rajesh Sharma (GreenCycle Facility)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-2', '8888888882', 'Sunil Patil (EcoBridge)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-3', '8888888883', 'Anand Deshmukh (Vidarbha Clean-Tech)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-4', '8888888884', 'Mahesh Joshi (Sahyadri)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-5', '8888888885', 'Vikram Shinde (Marathwada Metal)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-6', '8888888886', 'Harpreet Singh (National Capital)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-7', '8888888887', 'K. R. Narayana (Silicon Plate)', 'RECYCLER', 'en');
  insertUser.run('usr-recycler-8', '8888888888-2', 'M. S. Reddy (Deccan E-Recycle)', 'RECYCLER', 'en');
  insertUser.run(adminUserId, '7777777777', 'Dr. S. K. Verma (JNARDDC / MoM Admin)', 'ADMIN', 'en');

  // 2. COLLECTOR PROFILE
  const collectorId = 'col-ramesh-1';
  db.prepare(`
    INSERT INTO collectors (id, user_id, name, phone, location_name, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(collectorId, collectorUserId, 'Ramesh Kumar', '9999999999', 'Dharavi Sector 3, Mumbai', 19.0434, 72.8550);

  // 3. RECYCLERS (8 Demo Facilities with CPCB authorizations)
  const recyclers = [
    {
      id: 'rec-greencycle-mum',
      userId: recyclerUserId,
      name: 'Rajesh Sharma',
      facilityName: 'GreenCycle E-Waste Recyclers Pvt Ltd',
      authorizationNumber: 'CPCB/E-WASTE/2023/MH-092',
      authorizationStatus: 'AUTHORIZED',
      address: 'Plot 44, TTC Industrial Area, MIDC Mahape, Navi Mumbai',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      latitude: 19.1120,
      longitude: 73.0180,
      materialsAccepted: JSON.stringify(['PCB', 'BAT_LI', 'CABLE_CU', 'MOTORS', 'LCD', 'BAT_LEAD']),
      rates: JSON.stringify({
        'mat-pcb': 425,
        'mat-cable-cu': 535,
        'mat-bat-li': 150,
        'mat-motors': 190,
        'mat-lcd': 75,
        'mat-bat-lead': 110
      }),
      pickupAvailable: 1,
      serviceRadius: 35.0,
      rating: 4.85,
      contactPhone: '+91 98200 11223'
    },
    {
      id: 'rec-ecobridge-pune',
      userId: 'usr-recycler-2',
      name: 'Sunil Patil',
      facilityName: 'EcoBridge Critical Metals Recovery',
      authorizationNumber: 'MPCB/RO-PUNE/AUTH/2024/018',
      authorizationStatus: 'AUTHORIZED',
      address: 'Sector 7, Bhosari MIDC, Pimpri-Chinchwad',
      city: 'Pune',
      state: 'Maharashtra',
      latitude: 18.6270,
      longitude: 73.8390,
      materialsAccepted: JSON.stringify(['PCB', 'BAT_LI', 'MAGNET_ND', 'CABLE_CU']),
      rates: JSON.stringify({
        'mat-pcb': 430,
        'mat-cable-cu': 530,
        'mat-bat-li': 155,
        'mat-magnet-nd': 320
      }),
      pickupAvailable: 1,
      serviceRadius: 40.0,
      rating: 4.9,
      contactPhone: '+91 98230 44556'
    },
    {
      id: 'rec-jnarddc-partner-nagpur',
      userId: 'usr-recycler-3',
      name: 'Anand Deshmukh',
      facilityName: 'Vidarbha Clean-Tech Refiners (JNARDDC Partner)',
      authorizationNumber: 'CPCB/E-WASTE/2022/MH-041',
      authorizationStatus: 'AUTHORIZED',
      address: 'Hingna Industrial Estate, Wadi, Nagpur',
      city: 'Nagpur',
      state: 'Maharashtra',
      latitude: 21.1140,
      longitude: 79.0010,
      materialsAccepted: JSON.stringify(['PCB', 'BAT_LI', 'MOTORS', 'CRT', 'PLASTIC_MIX']),
      rates: JSON.stringify({
        'mat-pcb': 415,
        'mat-cable-cu': 520,
        'mat-bat-li': 148,
        'mat-motors': 185
      }),
      pickupAvailable: 1,
      serviceRadius: 50.0,
      rating: 4.75,
      contactPhone: '+91 98250 77889'
    },
    {
      id: 'rec-sahyadri-nashik',
      userId: 'usr-recycler-4',
      name: 'Mahesh Joshi',
      facilityName: 'Sahyadri Urban Miners',
      authorizationNumber: 'MPCB/NASHIK/AUTH/2023/112',
      authorizationStatus: 'AUTHORIZED',
      address: 'Ambad MIDC, Nashik',
      city: 'Nashik',
      state: 'Maharashtra',
      latitude: 19.9570,
      longitude: 73.7430,
      materialsAccepted: JSON.stringify(['CABLE_CU', 'MOTORS', 'BAT_LEAD', 'ELECTRONICS_MIX']),
      rates: JSON.stringify({
        'mat-cable-cu': 525,
        'mat-motors': 180,
        'mat-bat-lead': 105
      }),
      pickupAvailable: 0,
      serviceRadius: 20.0,
      rating: 4.6,
      contactPhone: '+91 98220 33445'
    },
    {
      id: 'rec-aurangabad-metals',
      userId: 'usr-recycler-5',
      name: 'Vikram Shinde',
      facilityName: 'Marathwada Metal Reclaimers',
      authorizationNumber: 'CPCB/E-WASTE/2024/MH-155',
      authorizationStatus: 'PENDING',
      address: 'Chikalthana MIDC, Chhatrapati Sambhajinagar',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      latitude: 19.8820,
      longitude: 75.3850,
      materialsAccepted: JSON.stringify(['PCB', 'CABLE_CU', 'MOTORS']),
      rates: JSON.stringify({
        'mat-pcb': 400,
        'mat-cable-cu': 510
      }),
      pickupAvailable: 1,
      serviceRadius: 25.0,
      rating: 4.3,
      contactPhone: '+91 98210 99881'
    },
    {
      id: 'rec-delhi-greens',
      userId: 'usr-recycler-6',
      name: 'Harpreet Singh',
      facilityName: 'National Capital Circular Hub',
      authorizationNumber: 'DPCC/E-WASTE/2023/DL-008',
      authorizationStatus: 'AUTHORIZED',
      address: 'Mayapuri Phase 2 & Okhla Phase 1',
      city: 'New Delhi',
      state: 'Delhi',
      latitude: 28.5280,
      longitude: 77.2790,
      materialsAccepted: JSON.stringify(['PCB', 'BAT_LI', 'CABLE_CU', 'MOTORS', 'MAGNET_ND']),
      rates: JSON.stringify({
        'mat-pcb': 435,
        'mat-cable-cu': 540,
        'mat-bat-li': 152
      }),
      pickupAvailable: 1,
      serviceRadius: 30.0,
      rating: 4.8,
      contactPhone: '+91 98110 55667'
    },
    {
      id: 'rec-bengaluru-urban-mine',
      userId: 'usr-recycler-7',
      name: 'K. R. Narayana',
      facilityName: 'Silicon Plate Clean Mining',
      authorizationNumber: 'KSPCB/E-WASTE/2023/KA-304',
      authorizationStatus: 'AUTHORIZED',
      address: 'Peenya Industrial Area 4th Phase, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      latitude: 13.0310,
      longitude: 77.5180,
      materialsAccepted: JSON.stringify(['PCB', 'BAT_LI', 'LCD', 'MAGNET_ND']),
      rates: JSON.stringify({
        'mat-pcb': 440,
        'mat-bat-li': 160,
        'mat-magnet-nd': 340
      }),
      pickupAvailable: 1,
      serviceRadius: 35.0,
      rating: 4.95,
      contactPhone: '+91 98450 11223'
    },
    {
      id: 'rec-hyderabad-ecoworks',
      userId: 'usr-recycler-8',
      name: 'M. S. Reddy',
      facilityName: 'Deccan E-Recycle Facility',
      authorizationNumber: 'TSPCB/E-WASTE/2023/TS-089',
      authorizationStatus: 'AUTHORIZED',
      address: 'Cherlapally IDA, Phase II, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      latitude: 17.4720,
      longitude: 78.5830,
      materialsAccepted: JSON.stringify(['PCB', 'CABLE_CU', 'MOTORS', 'BAT_LEAD']),
      rates: JSON.stringify({
        'mat-pcb': 420,
        'mat-cable-cu': 530,
        'mat-motors': 188
      }),
      pickupAvailable: 1,
      serviceRadius: 25.0,
      rating: 4.7,
      contactPhone: '+91 98490 88776'
    }
  ];

  const insertRecycler = db.prepare(`
    INSERT INTO recyclers (
      id, user_id, name, facility_name, authorization_number, authorization_status,
      address, city, state, latitude, longitude, materials_accepted, rates,
      pickup_available, service_radius, rating, contact_phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of recyclers) {
    insertRecycler.run(
      r.id, r.userId, r.name, r.facilityName, r.authorizationNumber, r.authorizationStatus,
      r.address, r.city, r.state, r.latitude, r.longitude, r.materialsAccepted, r.rates,
      r.pickupAvailable, r.serviceRadius, r.rating, r.contactPhone
    );
  }

  // 4. MATERIALS (10 distinct categories with critical minerals and hazard warnings)
  const materials = [
    {
      id: 'mat-pcb',
      code: 'PCB',
      name: 'High Grade PCB / Motherboards',
      nameHi: 'मदरबोर्ड / पीसीबी सर्किट',
      nameMr: 'मदरबोर्ड / पीसीबी सर्किट',
      category: 'Circuit Boards',
      subcategory: 'Server / Telecom / PC Grade',
      benchmarkPrice: 410,
      unit: 'KG',
      hazards: 'Do NOT acid-leach or burn. Contains toxic brominated flame retardants & lead fumes.',
      hazardsHi: 'एसिड में न घोलें और न जलाएं। जहरीले धुएं और एसिड से फेफड़े खराब हो सकते हैं।',
      hazardsMr: 'अ‍ॅसिडमध्ये विरघळवू नका किंवा जाळू नका. विषारी धूर आरोग्यासाठी घातक आहे.',
      criticalMinerals: JSON.stringify([
        { name: 'Copper (Cu)', percentage: '22%' },
        { name: 'Gold (Au)', percentage: '250 g/tonne' },
        { name: 'Silver (Ag)', percentage: '1,100 g/tonne' },
        { name: 'Tantalum (Ta)', percentage: '0.4%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Cpu',
      sampleImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-cable-cu',
      code: 'CABLE_CU',
      name: 'Copper Insulated Cable',
      nameHi: 'तांबे की इंसुलेटेड केबल',
      nameMr: 'तांब्याची इन्सुलेटेड वायर',
      category: 'Cables & Wiring',
      subcategory: 'Telecom & Power Wires',
      benchmarkPrice: 520,
      unit: 'KG',
      hazards: 'Do NOT burn open-air! Burning emits cancer-causing dioxins & furans. Sell intact with insulation.',
      hazardsHi: 'खुले में तार कभी न जलाएं! जहरीली गैस से कैंसर का खतरा होता है। सीधे कवर्ड ही बेचें।',
      hazardsMr: 'वायर उघड्यावर जाळू नका! विषारी वायूने कर्करोगाचा धोका असतो. कव्हरसह विका.',
      criticalMinerals: JSON.stringify([
        { name: 'Copper (Cu)', percentage: '55% - 75%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Zap',
      sampleImage: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-bat-li',
      code: 'BAT_LI',
      name: 'Lithium-Ion Battery (LFP / NMC)',
      nameHi: 'लिथियम बैटरी (मोबाइल / लैपटॉप / EV)',
      nameMr: 'लिथियम-आयन बॅटरी (मोबाईल / लॅपटॉप)',
      category: 'Batteries',
      subcategory: 'Li-ion Cells & Packs',
      benchmarkPrice: 145,
      unit: 'KG',
      hazards: 'CRITICAL FIRE RISK: Do NOT puncture, crush, or immerse in water. Store in sand/dry bucket.',
      hazardsHi: 'आग का भारी खतरा: बैटरी को छेदें, तोड़ें या पानी में न डालें। सूखी जगह रखें।',
      hazardsMr: 'आगीचा मोठा धोका: बॅटरी फोडू नका किंवा पाण्यात टाकू नका. कोरड्या जागेवर ठेवा.',
      criticalMinerals: JSON.stringify([
        { name: 'Lithium (Li)', percentage: '7%' },
        { name: 'Cobalt (Co)', percentage: '12%' },
        { name: 'Nickel (Ni)', percentage: '18%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'BatteryCharging',
      sampleImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-motors',
      code: 'MOTORS',
      name: 'Electric Motors & Alternators',
      nameHi: 'इलेक्ट्रिक मोटर / अल्टरनेटर',
      nameMr: 'इलेक्ट्रिक मोटार / अल्टरनेटर',
      category: 'Motors',
      subcategory: 'Copper-Wound Assemblies',
      benchmarkPrice: 185,
      unit: 'KG',
      hazards: 'Heavy weight pinch hazard. Wear gloves when handling broken casings.',
      hazardsHi: 'वजनी सामान: हाथ दबने का डर। टूटे हुए हिस्सों को छूते समय दस्ताने पहनें।',
      hazardsMr: 'जड साहित्य: हाताला दुखापत टाळण्यासाठी सुरक्षितपणे उचला.',
      criticalMinerals: JSON.stringify([
        { name: 'Copper (Cu)', percentage: '14%' },
        { name: 'Electrical Steel', percentage: '68%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Cog',
      sampleImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-magnet-nd',
      code: 'MAGNET_ND',
      name: 'Neodymium Rare Earth Magnets',
      nameHi: 'नियोडिमियम दुर्लभ चुंबक (HDD/Speaker)',
      nameMr: 'निओडिमियम दुर्मीळ चुंबक (हार्ड डिस्क)',
      category: 'Rare Earth Elements',
      subcategory: 'NdFeB Sintered Magnets',
      benchmarkPrice: 310,
      unit: 'KG',
      hazards: 'Extremely strong magnetic pinch hazard. Keep away from pacemakers & credit cards.',
      hazardsHi: 'बहुत तेज चुंबक: उंगलियां चिपकने का खतरा। पेसमेकर और फोन से दूर रखें।',
      hazardsMr: 'अतिशय शक्तिशाली चुंबक: बोटांना इजा होणार नाही याची काळजी घ्या.',
      criticalMinerals: JSON.stringify([
        { name: 'Neodymium (Nd)', percentage: '29%' },
        { name: 'Dysprosium (Dy)', percentage: '3%' },
        { name: 'Iron (Fe)', percentage: '65%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Magnet',
      sampleImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-lcd',
      code: 'LCD',
      name: 'LCD / LED Display Panels',
      nameHi: 'एलसीडी / एलईडी डिस्प्ले स्क्रीन',
      nameMr: 'एलसीडी / एलईडी स्क्रीन पॅनेल',
      category: 'Displays',
      subcategory: 'Flat Screen Backlights',
      benchmarkPrice: 70,
      unit: 'KG',
      hazards: 'Fragile glass shards. CCFL backlit older screens contain hazardous mercury vapour.',
      hazardsHi: 'कांच टूटने का खतरा। पुरानी स्क्रीन में जहरीला पारा (मर्करी) गैस हो सकती है।',
      hazardsMr: 'काच फुटण्याचा धोका. जुन्या स्क्रीनमध्ये विषारी पारा असू शकतो.',
      criticalMinerals: JSON.stringify([
        { name: 'Indium (In)', percentage: '0.04%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Tv',
      sampleImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-crt',
      code: 'CRT',
      name: 'Cathode Ray Tube (CRT Glass)',
      nameHi: 'पुराना टीवी / सीआरटी पिक्चर ट्यूब',
      nameMr: 'जुना टीव्ही / सीआरटी काच',
      category: 'Displays',
      subcategory: 'Leaded Glass Funnel',
      benchmarkPrice: 28,
      unit: 'KG',
      hazards: 'HIGH TOXICITY: Contains up to 2.5 kg of toxic lead in glass. Vacuum implosion risk.',
      hazardsHi: 'अत्यधिक जहरीला सीसा (Lead)। स्क्रीन कभी न फोड़ें, वैक्यूम धमाका हो सकता है।',
      hazardsMr: 'अत्यंत विषारी शिसे (Lead). स्क्रीन फोडू नका, स्फोटाचा धोका संभवतो.',
      criticalMinerals: JSON.stringify([
        { name: 'Lead (Pb)', percentage: '18%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Monitor',
      sampleImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-bat-lead',
      code: 'BAT_LEAD',
      name: 'Lead-Acid Storage Battery',
      nameHi: 'लेड-एसिड इन्वर्टर / ऑटो बैटरी',
      nameMr: 'लेड-अ‍ॅसिड इन्व्हर्टर बॅटरी',
      category: 'Batteries',
      subcategory: 'Flooded / VRLA',
      benchmarkPrice: 105,
      unit: 'KG',
      hazards: 'Contains corrosive sulfuric acid. Never drain acid into open drains or soil.',
      hazardsHi: 'खतरनाक तेजाब (Acid) अंदर भरा है। तेजाब को नाली या मिट्टी में कभी न बहाएं।',
      hazardsMr: 'घातक अ‍ॅसिड असते. अ‍ॅसिड गटारात किंवा मातीत टाकू नका.',
      criticalMinerals: JSON.stringify([
        { name: 'Lead (Pb)', percentage: '60%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Battery',
      sampleImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-elec-mix',
      code: 'ELECTRONICS_MIX',
      name: 'Mixed Consumer Electronics',
      nameHi: 'मिक्स्ड घरेलू इलेक्ट्रॉनिक्स',
      nameMr: 'मिश्र घरगुती इलेक्ट्रॉनिक्स',
      category: 'Mixed',
      subcategory: 'Appliances & Gadgets',
      benchmarkPrice: 85,
      unit: 'KG',
      hazards: 'Contains capacitors with stored charge. Do not pry open with metal tools.',
      hazardsHi: 'करंट का झटका लग सकता है। मेटल औजार से जबरदस्ती न खोलें।',
      hazardsMr: 'विजेचा धक्का बसू नये म्हणून काळजीपूर्वक हाताळा.',
      criticalMinerals: JSON.stringify([
        { name: 'Copper (Cu)', percentage: '8%' },
        { name: 'Aluminum (Al)', percentage: '15%' }
      ]),
      typicalCondition: 'INTACT',
      icon: 'Radio',
      sampleImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mat-plastic-mix',
      code: 'PLASTIC_MIX',
      name: 'Engineering Plastics (ABS/HIPS)',
      nameHi: 'इंजीनियरिंग प्लास्टिक (ABS / HIPS)',
      nameMr: 'इंजिनिअरिंग प्लास्टिक (ABS/HIPS)',
      category: 'Plastics',
      subcategory: 'Flame Retarded Casings',
      benchmarkPrice: 35,
      unit: 'KG',
      hazards: 'Do NOT melt down over stoves. Inhalation of halogen gases damages throat and eyes.',
      hazardsHi: 'चूल्हे पर कभी न पिघलाएं। धुएं से आंखें और गला जलने का खतरा है।',
      hazardsMr: 'प्लास्टिक जाळू नका. धुरामुळे श्वसनाचा त्रास होऊ शकतो.',
      criticalMinerals: JSON.stringify([]),
      typicalCondition: 'INTACT',
      icon: 'Layers',
      sampleImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const insertMaterial = db.prepare(`
    INSERT INTO materials (
      id, code, name, name_hi, name_mr, category, subcategory,
      benchmark_price, unit, hazards, hazards_hi, hazards_mr,
      critical_minerals, typical_condition, icon, sample_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const m of materials) {
    insertMaterial.run(
      m.id, m.code, m.name, m.nameHi, m.nameMr, m.category, m.subcategory,
      m.benchmarkPrice, m.unit, m.hazards, m.hazardsHi, m.hazardsMr,
      m.criticalMinerals, m.typicalCondition, m.icon, m.sampleImage
    );
  }

  // 5. CURRENT BENCHMARK PRICES & 30-DAY HISTORICAL TRENDS
  const insertPrice = db.prepare(`
    INSERT INTO prices (id, material_id, benchmark_rate, trend_direction, trend_percentage)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO price_history (id, material_id, date, rate)
    VALUES (?, ?, ?, ?)
  `);

  const trends = {
    'mat-pcb': { rate: 410, trend: 'UP', pct: 1.8 },
    'mat-cable-cu': { rate: 520, trend: 'UP', pct: 2.4 },
    'mat-bat-li': { rate: 145, trend: 'DOWN', pct: -1.1 },
    'mat-motors': { rate: 185, trend: 'UP', pct: 0.8 },
    'mat-magnet-nd': { rate: 310, trend: 'STABLE', pct: 0.2 },
    'mat-lcd': { rate: 70, trend: 'DOWN', pct: -0.5 },
    'mat-crt': { rate: 28, trend: 'STABLE', pct: 0.0 },
    'mat-bat-lead': { rate: 105, trend: 'UP', pct: 1.2 },
    'mat-elec-mix': { rate: 85, trend: 'STABLE', pct: 0.3 },
    'mat-plastic-mix': { rate: 35, trend: 'STABLE', pct: 0.0 }
  };

  for (const [matId, val] of Object.entries(trends)) {
    insertPrice.run(`prc-${matId}`, matId, val.rate, val.trend, val.pct);

    // Generate 30 days of deterministic realistic curve
    const today = new Date('2026-09-11');
    for (let day = 30; day >= 0; day--) {
      const d = new Date(today);
      d.setDate(d.getDate() - day);
      const dateStr = d.toISOString().split('T')[0];
      // Controlled sine/variance for realistic chart
      const variance = Math.sin(day * 0.4) * (val.rate * 0.04) + ((30 - day) * (val.pct * 0.01 * val.rate) / 30);
      const histRate = Math.round((val.rate - variance) * 10) / 10;
      insertHistory.run(uuidv4(), matId, dateStr, histRate);
    }
  }

  // 6. SAMPLE LOTS & TRANSACTIONS
  const sampleLots = [
    {
      id: 'lot-demo-1',
      code: 'LOT-2026-MH-4821',
      collectorId: collectorId,
      materialId: 'mat-pcb',
      weight: 12.5,
      condition: 'INTACT',
      estimatedPrice: 5312.5, // 12.5 * 425
      finalPrice: 5185.0,     // 12.2 * 425
      photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      aiPredictedCategory: 'High Grade Server PCB',
      aiConfidence: 0.94,
      status: 'COMPLETED',
      recyclerId: 'rec-greencycle-mum'
    },
    {
      id: 'lot-demo-2',
      code: 'LOT-2026-MH-4819',
      collectorId: collectorId,
      materialId: 'mat-cable-cu',
      weight: 31.0,
      condition: 'INTACT',
      estimatedPrice: 16585.0, // 31.0 * 535
      finalPrice: 16585.0,
      photoUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80',
      aiPredictedCategory: 'Copper Insulated Cable',
      aiConfidence: 0.97,
      status: 'PICKUP_SCHEDULED',
      recyclerId: 'rec-greencycle-mum'
    },
    {
      id: 'lot-demo-3',
      code: 'LOT-2026-MH-4830',
      collectorId: collectorId,
      materialId: 'mat-bat-li',
      weight: 8.0,
      condition: 'INTACT',
      estimatedPrice: 1200.0,
      finalPrice: null,
      photoUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      aiPredictedCategory: 'Lithium-Ion Pack',
      aiConfidence: 0.91,
      status: 'NEW',
      recyclerId: null
    }
  ];

  const insertLot = db.prepare(`
    INSERT INTO lots (
      id, code, collector_id, material_id, weight, condition,
      estimated_price, final_price, photo_url, ai_predicted_category,
      ai_confidence, status, recycler_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of sampleLots) {
    insertLot.run(
      l.id, l.code, l.collectorId, l.materialId, l.weight, l.condition,
      l.estimatedPrice, l.finalPrice, l.photoUrl, l.aiPredictedCategory,
      l.aiConfidence, l.status, l.recyclerId
    );
  }

  // 7. COMPLETED HANDOVER & TRANSACTION RECORD
  const handoverId = 'hnd-demo-1';
  db.prepare(`
    INSERT INTO handover_records (
      id, lot_id, collector_id, recycler_id, initial_weight,
      verified_weight, final_price, payment_method, payment_reference, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    handoverId, 'lot-demo-1', collectorId, 'rec-greencycle-mum',
    12.5, 12.2, 5185.0, 'UPI', 'UPI-982173-SBI', 'Calibrated digital bench scale verified. Intact condition bonus applied.'
  );

  db.prepare(`
    INSERT INTO transactions (
      id, handover_record_id, lot_id, collector_id, recycler_id,
      amount, status, payment_method, reference_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'txn-demo-1', handoverId, 'lot-demo-1', collectorId, 'rec-greencycle-mum',
    5185.0, 'PAID', 'UPI', 'UPI-982173-SBI'
  );

  // 8. TRACEABILITY EVENTS (Full chain of custody)
  const insertEvent = db.prepare(`
    INSERT INTO traceability_events (id, lot_id, event_type, description, actor_id, actor_role, location_lat, location_lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEvent.run(uuidv4(), 'lot-demo-1', 'CREATED', 'Lot created with AI classification (94% confidence)', collectorId, 'COLLECTOR', 19.0434, 72.8550);
  insertEvent.run(uuidv4(), 'lot-demo-1', 'ACCEPTED', 'GreenCycle Recycling accepted lot at ₹425/kg', 'rec-greencycle-mum', 'RECYCLER', 19.1120, 73.0180);
  insertEvent.run(uuidv4(), 'lot-demo-1', 'VERIFIED', 'Physical handover verified: 12.2 KG verified weight', 'rec-greencycle-mum', 'RECYCLER', 19.1120, 73.0180);
  insertEvent.run(uuidv4(), 'lot-demo-1', 'PAID', 'Payment ₹5,185 completed via UPI reference UPI-982173-SBI', 'rec-greencycle-mum', 'RECYCLER', 19.1120, 73.0180);

  // 9. SAFETY GUIDES (Illustrated DOs and DONTs in EN, HI, MR)
  const safetyGuides = [
    {
      id: 'sg-cable-burning',
      title: 'Never Burn Cables in Open Air',
      titleHi: 'खुले में कभी तार न जलाएं',
      titleMr: 'उघड्यावर वायर्स कधीही जाळू नका',
      description: 'Burning plastic insulation releases deadly dioxins & furans that cause cancer and asthma. Authorized recyclers pay more for unburnt intact cable.',
      descriptionHi: 'प्लास्टिक जलाने से जहरीला धुआं निकलता है जिससे कैंसर और सांस की बीमारियां होती हैं। ऑथराइज्ड रिसाइकलर साबुत तार का ज्यादा दाम देते हैं।',
      descriptionMr: 'प्लास्टिक जाळल्याने कर्करोगाचा धोका असणारा धूर निघतो. न जाळलेल्या वायर्सला अधिक भाव मिळतो.',
      type: 'DONT',
      icon: 'Flame',
      category: 'CABLES'
    },
    {
      id: 'sg-acid-leach',
      title: 'Do Not Acid-Leach Circuit Boards',
      titleHi: 'पीसीबी पर एसिड (तेजाब) का प्रयोग न करें',
      titleMr: 'पीसीबीवर अ‍ॅसिड टाकू नका',
      description: 'Crude aqua-regia acid baths destroy human lungs, cause chemical blindness, and leave 60% of precious metals unrecovered in toxic sludge.',
      descriptionHi: 'तेजाब से फेफड़े खराब होते हैं और आंखों की रोशनी जा सकती है। केवल औपचारिक रिसाइकलर ही सुरक्षित तरीके से 99% सोना निकाल सकते हैं।',
      descriptionMr: 'अ‍ॅसिडमुळे डोळ्यांना व फुफ्फुसांना इजा होते. अधिकृत रिसायकलिंगमधूनच पूर्ण धातू मिळतात.',
      type: 'DONT',
      icon: 'FlaskConical',
      category: 'PCBS'
    },
    {
      id: 'sg-puncture-battery',
      title: 'Never Puncture or Crush Batteries',
      titleHi: 'बैटरी को कभी छेदें या हथौड़े से न तोड़ें',
      titleMr: 'बॅटरीवर छिद्र पाडू नका किंवा हातोड्याने फोडू नका',
      description: 'Lithium reacts violently with moisture, causing thermal runaway explosions and intense chemical fires up to 1,000°C.',
      descriptionHi: 'लिथियम बैटरी हवा और नमी के संपर्क में आते ही धमाके के साथ फट सकती है और 1,000°C तक की भयानक आग लगा सकती है।',
      descriptionMr: 'लिथियम बॅटरीमध्ये स्फोट होऊन तीव्र आग लागण्याचा धोका असतो. बॅटरी कोरड्या जागी ठेवा.',
      type: 'DONT',
      icon: 'AlertTriangle',
      category: 'BATTERIES'
    },
    {
      id: 'sg-store-dry',
      title: 'Keep E-Waste Dry & Ventilated',
      titleHi: 'ई-कचरे को हमेशा सूखी जगह पर रखें',
      titleMr: 'ई-कचरा नेहमी कोरड्या व हवेशीर जागी ठेवा',
      description: 'Moisture causes corrosion, dissolves toxic heavy metal salts into ground water, and decreases the sale price of electronic scrap.',
      descriptionHi: 'पानी लगने से मेटल में जंग लग जाता है, कीमती धातुएं खराब होती हैं और बाजार में कम कीमत मिलती है।',
      descriptionMr: 'पाण्यामुळे धातू खराब होतात आणि बाजारात कमी भाव मिळतो. नेहमी कोरडे ठेवा.',
      type: 'DO',
      icon: 'ShieldCheck',
      category: 'STORAGE'
    },
    {
      id: 'sg-sell-intact',
      title: 'Sell Intact Components for Bonus Rate',
      titleHi: 'सामान को बिना तोड़े साबुत बेचें (बोनस रेट)',
      titleMr: 'घटक न तोडता अखंड विका (बोनस दर)',
      description: 'Formal recyclers offer up to 15% quality premium for complete, unbroken motherboards and unpunctured battery packs.',
      descriptionHi: 'बिना तोड़-फोड़ के साबुत मदरबोर्ड और बैटरी बेचने पर रिसाइकलर 15% तक अतिरिक्त बोनस मूल्य देते हैं।',
      descriptionMr: 'सामान अखंड ठेवल्यास अधिकृत रिसायकलर १५% पर्यंत जास्तीचा दर देतात.',
      type: 'DO',
      icon: 'Sparkles',
      category: 'BEST_PRACTICES'
    }
  ];

  const insertSafety = db.prepare(`
    INSERT INTO safety_guides (
      id, title, title_hi, title_mr, description, description_hi, description_mr, type, icon, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of safetyGuides) {
    insertSafety.run(
      s.id, s.title, s.titleHi, s.titleMr, s.description, s.descriptionHi, s.descriptionMr,
      s.type, s.icon, s.category
    );
  }

  console.log('✅ Seed completed successfully with realistic Indian e-waste demo datasets!');
}

// Auto-run if executed directly
seedDatabase();
