import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts"; // Initialize i18n
import { setupGlobalErrorHandling, debugExtensionConflicts, suppressVendorErrors } from "./utils/debugUtils";

// Initialize debugging and error handling FIRST to catch vendor.js errors
suppressVendorErrors();
setupGlobalErrorHandling();
debugExtensionConflicts();

// Initialize API validation
console.log("🚀 Starting Tariff Management Suite...");
console.log("API Configuration Status:", {
  openrouter: import.meta.env.VITE_OPENROUTER_API_KEY
    ? "✅ configured"
    : "❌ missing",
  shippo: import.meta.env.VITE_SHIPPO_API_KEY ? "✅ configured" : "❌ missing",
  comtrade: import.meta.env.VITE_UN_COMTRADE_PRIMARY_KEY
    ? "✅ configured"
    : "❌ missing",
  federalRegister: "✅ public API",
  supabase: import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    ? "✅ configured"
    : "❌ missing",
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  import.meta.env.DEV ? (
    // In development, avoid StrictMode to prevent message channel issues
    <App />
  ) : (
    // In production, use StrictMode for better React practices
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
);
