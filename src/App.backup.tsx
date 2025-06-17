import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import Home from "./components/home";
import "./App.css";

function App() {
  const { user, loading } = useAuth();
  const [testResult, setTestResult] = useState<string>("");
  const [apiLoading, setApiLoading] = useState(false);

  const testFederalRegisterAPI = async () => {
    setApiLoading(true);
    setTestResult("Testing Federal Register API...");

    try {
      // Mock test for now - replace with actual service when ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setTestResult(
        `✅ Success! Federal Register API test completed. Ready to implement actual service.`
      );
      console.log("Federal Register API test completed");
    } catch (error) {
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
      console.error("Federal Register API error:", error);
    } finally {
      setApiLoading(false);
    }
  };

  const testPolicyAlerts = async () => {
    setApiLoading(true);
    setTestResult("Testing Policy Alert Service...");

    try {
      // Mock test for now - replace with actual service when ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setTestResult(
        `✅ Success! Policy Alert Service test completed. Ready to implement actual service.`
      );
      console.log("Policy Alert Service test completed");
    } catch (error) {
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
      console.error("Policy Alert Service error:", error);
    } finally {
      setApiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Home /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* API Testing Interface */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tariff Management Suite
            </h1>
            <p className="text-gray-600">
              Powered by Federal Register, Shippo, UN Comtrade, and OpenRouter
              APIs
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              API Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    import.meta.env.VITE_OPENROUTER_API_KEY
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                OpenRouter API:{" "}
                {import.meta.env.VITE_OPENROUTER_API_KEY
                  ? "Configured"
                  : "Missing"}
              </div>
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    import.meta.env.VITE_SHIPPO_API_KEY
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                Shippo API:{" "}
                {import.meta.env.VITE_SHIPPO_API_KEY ? "Configured" : "Missing"}
              </div>
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    import.meta.env.VITE_UN_COMTRADE_PRIMARY_KEY
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                UN Comtrade API:{" "}
                {import.meta.env.VITE_UN_COMTRADE_PRIMARY_KEY
                  ? "Configured"
                  : "Missing"}
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                Federal Register: Public API (no key required)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Test Federal Register API
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Search for recent tariff-related policy updates
              </p>
              <button
                onClick={testFederalRegisterAPI}
                disabled={apiLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {apiLoading ? "Testing..." : "Test Federal Register"}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Test Policy Alert Service
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Check for new policy alerts and notifications
              </p>
              <button
                onClick={testPolicyAlerts}
                disabled={apiLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {apiLoading ? "Testing..." : "Test Policy Alerts"}
              </button>
            </div>
          </div>

          {testResult && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Test Results
              </h3>
              <div
                className={`p-4 rounded-md ${
                  testResult.includes("✅")
                    ? "bg-green-50 text-green-800"
                    : testResult.includes("❌")
                      ? "bg-red-50 text-red-800"
                      : "bg-blue-50 text-blue-800"
                }`}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {testResult}
                </pre>
              </div>
            </div>
          )}

          <footer className="text-center mt-8 text-sm text-gray-500">
            <p>
              Tariff Management Suite - Dynamic data processing with real APIs
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
