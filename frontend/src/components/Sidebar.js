import React from "react";

function Sidebar({ setPage, page }) {
  const btnStyle = (active) => ({
    padding: "14px 22px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    background: active ? "#2ecc71" : "transparent",
    color: active ? "#fff" : "#555",
    fontSize: "15px"
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        background: "#fff",
        padding: "10px",
        borderRadius: "16px",
        marginBottom: "25px"
      }}
    >
      <button style={btnStyle(page==="overview")} onClick={() => setPage("overview")}>📊 Overview</button>
      <button style={btnStyle(page==="dishes")} onClick={() => setPage("dishes")}>🍽 Dishes</button>
      <button style={btnStyle(page==="tables")} onClick={() => setPage("tables")}>🪑 Tables</button>
      <button style={btnStyle(page==="reservations")} onClick={() => setPage("reservations")}>📅 Reservations</button>
      <button
  style={btnStyle(page === "ai")}
  onClick={() => setPage("ai")}
>
  🤖 AI Insights
</button>
    </div>
  );
}

export default Sidebar;