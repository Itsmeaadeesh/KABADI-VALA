export interface ClassificationResult {
  materialId: string;
  code: string;
  name: string;
  nameHi: string;
  nameMr: string;
  confidence: number;
  subGrade: string;
  criticalMinerals: string[];
  hazardWarning: string;
  hazardWarningHi: string;
  hazardWarningMr: string;
  suggestedCondition: 'INTACT' | 'DAMAGED' | 'STRIPPED';
}

export interface SampleEwasteItem {
  id: string;
  name: string;
  nameHi: string;
  thumbnail: string;
  result: ClassificationResult;
}

export const SAMPLE_EWASTE_PHOTOS: SampleEwasteItem[] = [
  {
    id: 'sample-pcb',
    name: 'Server Motherboard (PCB)',
    nameHi: 'सर्वर मदरबोर्ड (पीसीबी)',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    result: {
      materialId: 'mat-pcb',
      code: 'PCB',
      name: 'High Grade PCB / Motherboard',
      nameHi: 'मदरबोर्ड / पीसीबी सर्किट',
      nameMr: 'मदरबोर्ड / पीसीबी सर्किट',
      confidence: 0.94,
      subGrade: 'High Grade Server PCB (Gold Plated Connectors)',
      criticalMinerals: ['Copper (22%)', 'Gold (250 g/t)', 'Silver (1,100 g/t)', 'Tantalum (0.4%)'],
      hazardWarning: 'Do NOT acid-leach or burn. High toxic emissions.',
      hazardWarningHi: 'तेजाब में न घोलें और न जलाएं। जहरीले धुएं से फेफड़े खराब होते हैं।',
      hazardWarningMr: 'अ‍ॅसिडमध्ये विरघळवू नका किंवा जाळू नका.',
      suggestedCondition: 'INTACT'
    }
  },
  {
    id: 'sample-cable',
    name: 'Copper Insulated Wires',
    nameHi: 'तांबे की इंसुलेटेड केबल',
    thumbnail: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80',
    result: {
      materialId: 'mat-cable-cu',
      code: 'CABLE_CU',
      name: 'Copper Insulated Cable',
      nameHi: 'तांबे की इंसुलेटेड केबल',
      nameMr: 'तांब्याची इन्सुलेटेड वायर',
      confidence: 0.97,
      subGrade: 'Industrial Grade Stranded Copper (70% recovery)',
      criticalMinerals: ['Copper (68%)'],
      hazardWarning: 'Do NOT open-air burn. Toxic dioxin fumes cause severe lung damage.',
      hazardWarningHi: 'खुले में तार कभी न जलाएं! जहरीली गैस से कैंसर का खतरा होता है।',
      hazardWarningMr: 'वायर उघड्यावर जाळू नका! विषारी वायूचा धोका असतो.',
      suggestedCondition: 'INTACT'
    }
  },
  {
    id: 'sample-battery',
    name: 'Lithium-Ion Battery Pack',
    nameHi: 'लिथियम बैटरी (लैपटॉप/EV)',
    thumbnail: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    result: {
      materialId: 'mat-bat-li',
      code: 'BAT_LI',
      name: 'Lithium-Ion Battery',
      nameHi: 'लिथियम बैटरी (मोबाइल / लैपटॉप)',
      nameMr: 'लिथियम-आयन बॅटरी',
      confidence: 0.92,
      subGrade: 'NMC / LFP Prismatic Cells',
      criticalMinerals: ['Lithium (7%)', 'Cobalt (12%)', 'Nickel (18%)'],
      hazardWarning: 'FIRE HAZARD: Do NOT puncture or hammer. Store in sand.',
      hazardWarningHi: 'आग का भारी खतरा: बैटरी को छेदें, तोड़ें या पानी में न डालें।',
      hazardWarningMr: 'आगीचा धोका: बॅटरी फोडू नका किंवा पाण्यात टाकू नका.',
      suggestedCondition: 'INTACT'
    }
  },
  {
    id: 'sample-motor',
    name: 'Electric Motor Assembly',
    nameHi: 'इलेक्ट्रिक मोटर / अल्टरनेटर',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    result: {
      materialId: 'mat-motors',
      code: 'MOTORS',
      name: 'Electric Motors & Alternators',
      nameHi: 'इलेक्ट्रिक मोटर / अल्टरनेटर',
      nameMr: 'इलेक्ट्रिक मोटार / अल्टरनेटर',
      confidence: 0.95,
      subGrade: 'Copper-wound Stator Assembly',
      criticalMinerals: ['Copper (14%)', 'Silicon Steel (68%)'],
      hazardWarning: 'Heavy pinch hazard. Handle with protective gloves.',
      hazardWarningHi: 'वजनी सामान: हाथ दबने का डर। दस्ताने पहनें।',
      hazardWarningMr: 'जड साहित्य: काळजीपूर्वक हाताळा.',
      suggestedCondition: 'INTACT'
    }
  }
];

export class AIClassifierService {
  /**
   * Demo AI classifier function.
   * In a future production deployment, this will call a TensorFlow Lite or PyTorch
   * vision endpoint trained on the JNARDDC E-Waste Component Dataset.
   */
  static async classifyImage(imageSource: string): Promise<ClassificationResult> {
    // Simulate lightweight inference latency (600ms)
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check if matching sample
    const sample = SAMPLE_EWASTE_PHOTOS.find(s => s.thumbnail === imageSource);
    if (sample) {
      return sample.result;
    }

    // Default high-confidence prediction for user-uploaded photo
    return {
      materialId: 'mat-pcb',
      code: 'PCB',
      name: 'High Grade PCB / Motherboard',
      nameHi: 'मदरबोर्ड / पीसीबी सर्किट',
      nameMr: 'मदरबोर्ड / पीसीबी सर्किट',
      confidence: 0.94,
      subGrade: 'Multi-layer Circuit Board (High Copper & Gold Yield)',
      criticalMinerals: ['Copper (22%)', 'Gold (250 g/t)', 'Silver (1,100 g/t)', 'Tantalum (0.4%)'],
      hazardWarning: 'Do NOT burn or acid-leach! Brominated flame retardants present.',
      hazardWarningHi: 'तेजाब में न घोलें और न जलाएं। जहरीले धुएं से फेफड़े खराब होते हैं।',
      hazardWarningMr: 'अ‍ॅसिडमध्ये विरघळवू नका किंवा जाळू नका.',
      suggestedCondition: 'INTACT'
    };
  }
}
