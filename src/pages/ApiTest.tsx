import React, { useState, useEffect } from "react";
import { FederalRegisterService } from "../services/federalRegisterService";
import { PolicyAlertService } from "../services/policyAlertService";

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [federalRegisterData, setFederalRegisterData] = useState<any>(null);
  const [policyAlerts, setPolicyAlerts] = useState<any[]>([]);

  const testFederalRegisterAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await FederalRegisterService.searchTariffRelatedDocuments(
        30,
        5
      );
      setFederalRegisterData(data);
      console.log("Federal Register API response:", data);
    } catch (err) {
      setError(
        `Federal Register API error: ${err instanceof Error ? err.message : String(err)}`
      );
      console.error("Federal Register API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testPolicyAlertService = async () => {
    setLoading(true);
    setError(null);
    try {
      const alerts = await PolicyAlertService.checkForNewAlerts(
        ["steel", "semiconductors"],
        ["Electronics"]
      );
      setPolicyAlerts(alerts);
      console.log("Policy alerts:", alerts);
    } catch (err) {
      setError(
        `Policy Alert Service error: ${err instanceof Error ? err.message : String(err)}`
      );
      console.error("Policy Alert Service error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Testing Page</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">API Keys Loaded:</h2>
        <ul className="list-disc pl-6">
          <li>
            OpenRouter API Key:{" "}
            {import.meta.env.VITE_OPENROUTER_API_KEY ? "✓ Loaded" : "✗ Missing"}
          </li>
          <li>
            UN Comtrade API Key:{" "}
            {import.meta.env.VITE_UN_COMTRADE_PRIMARY_KEY
              ? "✓ Loaded"
              : "✗ Missing"}
          </li>
          <li>
            Shippo API Key:{" "}
            {import.meta.env.VITE_SHIPPO_API_KEY ? "✓ Loaded" : "✗ Missing"}
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={testFederalRegisterAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Test Federal Register API"}
        </button>

        <button
          onClick={testPolicyAlertService}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Test Policy Alert Service"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {federalRegisterData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Federal Register Results:
          </h3>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            {federalRegisterData.length > 0 ? (
              <ul className="divide-y divide-gray-300">
                {federalRegisterData.map((item: any) => (
                  <li key={item.id} className="py-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{item.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Published:{" "}
                        {new Date(item.publicationDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Impact: {item.tariffImpact}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      )}

      {policyAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Policy Alerts ({policyAlerts.length}):
          </h3>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <ul className="divide-y divide-gray-300">
              {policyAlerts.map(alert => (
                <li key={alert.id} className="py-2">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{alert.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Date: {new Date(alert.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        alert.impact === "high"
                          ? "bg-red-100 text-red-800"
                          : alert.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      Impact: {alert.impact}
                    </span>
                  </div>
                  <div className="mt-2">
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View on Federal Register
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
