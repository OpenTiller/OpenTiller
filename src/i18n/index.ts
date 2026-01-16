import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import ptBR from "./locales/pt-BR.json";

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "es-419", name: "Español (Latinoamérica)", flag: "🇲🇽" },
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
] as const;

export type SupportedLanguageCode = (typeof supportedLanguages)[number]["code"];

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  "es-419": { translation: es }, // Use Spanish for Latin America for now
  de: { translation: de },
  "pt-BR": { translation: ptBR },
  // TODO: Add remaining languages
  it: { translation: en },
  ja: { translation: en },
  ko: { translation: en },
  hi: { translation: en },
  id: { translation: en },
};

// Detect user's preferred language
function detectLanguage(): string {
  // Try to get from localStorage first
  const stored = localStorage.getItem("opentiller-language");
  if (stored && stored in resources) {
    return stored;
  }

  // Fall back to browser language
  const browserLang = navigator.language;

  // Check for exact match first
  if (browserLang in resources) {
    return browserLang;
  }

  // Check for base language match (e.g., "fr-FR" -> "fr")
  const baseLang = browserLang.split("-")[0];
  if (baseLang in resources) {
    return baseLang;
  }

  return "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

// Save language preference when it changes
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("opentiller-language", lng);
});

export default i18n;
