import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { BusinessDataProvider } from "./contexts/BusinessDataContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Home from "./components/home";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <BusinessDataProvider>
            <WorkflowProvider>
              <Home />
            </WorkflowProvider>
          </BusinessDataProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
