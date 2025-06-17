import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import commonEN from "./locales/en/common.json";
import landingEN from "./locales/en/landing.json";
import dashboardEN from "./locales/en/dashboard.json";
import authEN from "./locales/en/auth.json";
import componentsEN from "./locales/en/components.json";

import commonES from "./locales/es/common.json";
import landingES from "./locales/es/landing.json";
import dashboardES from "./locales/es/dashboard.json";
import authES from "./locales/es/auth.json";
import componentsES from "./locales/es/components.json";

const resources = {
  en: {
    common: commonEN,
    landing: landingEN,
    dashboard: dashboardEN,
    auth: authEN,
    components: componentsEN,
  },
  es: {
    common: commonES,
    landing: landingES,
    dashboard: dashboardES,
    auth: authES,
    components: componentsES,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language set to English
    fallbackLng: "en", // Fallback to English
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
