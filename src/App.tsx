import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import LandingPage from "./components/LandingPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BusinessDataProvider } from "./contexts/BusinessDataContext";
import { DataProvider } from "./contexts/DataContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";

// Protected route wrapper for authenticated content
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public route wrapper that redirects authenticated users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log(
    "🌐 PublicRoute - user:",
    user ? "authenticated" : "not authenticated",
    "loading:",
    loading
  );

  if (loading) {
    console.log("⏳ PublicRoute - showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    console.log(
      "🔄 PublicRoute - user authenticated, redirecting to dashboard"
    );
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ PublicRoute - showing landing page");
  return <>{children}</>;
};

function App() {
  console.log("🚀 App component starting...");
  console.log("Demo mode:", import.meta.env.VITE_DEMO_MODE);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public landing page route */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />

            {/* Protected dashboard route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DataProvider>
                    <BusinessDataProvider>
                      <WorkflowProvider>
                        <Home />
                      </WorkflowProvider>
                    </BusinessDataProvider>
                  </DataProvider>
                </ProtectedRoute>
              }
            />

            {/* Fallback route - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
