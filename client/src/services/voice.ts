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
    this.onStateChangeListeners.forEach(l => {
      try {
        l(isSpeaking, text);
      } catch (e) {
        console.warn('Error in voice listener:', e);
      }
    });
  }

  static stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
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

    try {
      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;

      // Pick appropriate voice
      let voices: SpeechSynthesisVoice[] = [];
      try {
        voices = this.synth.getVoices() || [];
      } catch (e) {
        voices = [];
      }

      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find(v => v.lang.includes('hi') || (v.name && v.name.toLowerCase().includes('hindi')));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (lang === 'mr') {
        utterance.lang = 'mr-IN';
        const mrVoice = voices.find(v => v.lang.includes('mr') || (v.name && v.name.toLowerCase().includes('marathi')));
        if (mrVoice) utterance.voice = mrVoice;
        else {
          const fallbackHi = voices.find(v => v.lang.includes('hi'));
          if (fallbackHi) utterance.voice = fallbackHi;
        }
      } else {
        utterance.lang = 'en-IN';
        const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.rate = 0.95;
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
    } catch (err) {
      console.warn('SpeechSynthesis error on device:', err);
      // Fallback: still notify UI so subtitles/visual cues show up
      this.notify(true, text);
      setTimeout(() => this.notify(false, ''), 4000);
    }
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
