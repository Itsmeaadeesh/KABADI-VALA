export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static onStateChangeListeners: Array<(isSpeaking: boolean, text: string) => void> = [];

  static subscribe(listener: (isSpeaking: boolean, text: string) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private static notify(isSpeaking: boolean, text: string) {
    this.onStateChangeListeners.forEach(l => l(isSpeaking, text));
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false, '');
    }
  }

  static speak(text: string, lang: 'en' | 'hi' | 'mr' = 'hi') {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this device. Displaying text transcript:', text);
      this.notify(true, text);
      setTimeout(() => this.notify(false, ''), 4000);
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    // Pick appropriate voice
    const voices = this.synth.getVoices();
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else if (lang === 'mr') {
      utterance.lang = 'mr-IN';
      const mrVoice = voices.find(v => v.lang.includes('mr') || v.name.toLowerCase().includes('marathi'));
      if (mrVoice) utterance.voice = mrVoice;
      else {
        // Fallback to Hindi voice for Marathi devanagari pronunciation
        const fallbackHi = voices.find(v => v.lang.includes('hi'));
        if (fallbackHi) utterance.voice = fallbackHi;
      }
    } else {
      utterance.lang = 'en-IN';
      const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.rate = 0.95; // Slightly slower for low-literacy clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.notify(true, text);
    };

    utterance.onend = () => {
      this.notify(false, '');
    };

    utterance.onerror = () => {
      this.notify(false, '');
    };

    this.synth.speak(utterance);
  }

  // Helper vernacular phrase generators
  static getPricePhrase(materialName: string, rate: number, lang: 'en' | 'hi' | 'mr'): string {
    if (lang === 'hi') {
      return `${materialName} का आज का भाव ₹${rate} प्रति किलोग्राम है।`;
    }
    if (lang === 'mr') {
      return `${materialName} चा आजचा दर ₹${rate} प्रति किलो आहे.`;
    }
    return `Today's benchmark rate for ${materialName} is ₹${rate} per kilogram.`;
  }

  static getEstimatePhrase(weight: number, materialName: string, total: number, lang: 'en' | 'hi' | 'mr'): string {
    if (lang === 'hi') {
      return `${weight} किलो ${materialName} का अनुमानित दाम लगभग ₹${total} है।`;
    }
    if (lang === 'mr') {
      return `${weight} किलो ${materialName} ची अंदाजे रक्कम ₹${total} आहे.`;
    }
    return `The estimated value for ${weight} kg of ${materialName} is approximately ₹${total}.`;
  }
}
