import React from "react";

const TestPage: React.FC = () => {
  console.log("🧪 TestPage component rendering");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "20px" }}>
        🎯 Demo Mode Active
      </h1>
      <p
        style={{
          color: "#666",
          fontSize: "18px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        The SMB Tariff Suite is running in demo mode. Click the button below to
        test authentication.
      </p>
      <button
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#ff6b35",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={() => {
          alert(
            "Demo credentials:\nEmail: demo@tradenavigator.com\nPassword: demo123"
          );
        }}
      >
        Show Demo Credentials
      </button>
    </div>
  );
};

export default TestPage;
