import React from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tariff Management Suite
        </h1>
        <p className="text-gray-600 mb-6">
          Application is loading successfully! 🎉
        </p>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Server running on port 3000</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">React app loaded</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Tailwind CSS working</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
