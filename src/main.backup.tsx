import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import "./index.css";

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
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <WorkflowProvider>
            <App />
          </WorkflowProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
