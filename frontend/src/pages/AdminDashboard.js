import React, { useState, useEffect } from "react";
import API from "../api/api";

import Sidebar from "../components/Sidebar";
import Dishes from "./Dishes";
import Tables from "./Tables";
import Reservations from "./Reservations";
import Overview from "./Overview";
import AIInsights from "./AIInsights";
import bgImage from "./images/d.jpg";

function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [notifications, setNotifications] = useState([]);
 const [showNotifications, setShowNotifications] = useState(false);
  const adminId = localStorage.getItem("adminId");

useEffect(() => {
  if (!adminId) return;

  const loadNotifications = () => {
    API.get(`/notifications/${adminId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  };

  loadNotifications();

  const interval = setInterval(loadNotifications, 3000);

  return () => clearInterval(interval);
}, [adminId]);

  const logout = () => {
    localStorage.removeItem("adminId");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Blur Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(0px)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          zIndex: 0,
        }}
      ></div>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <h1 style={{ color: "#2e7d32" }}>🍽️ DINEFLEX</h1>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>🏠 Dashboard</span>

            {/* Notification Bell */}
            <div
  style={{
    position: "relative",
    fontSize: "24px",
    cursor: "pointer",
  }}
  title="Notifications"
  onClick={() => setShowNotifications(!showNotifications)}
>
  🔔

  {notifications.filter((n) => !n.isRead).length > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-5px",
        right: "-8px",
        background: "red",
        color: "#fff",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        fontSize: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {notifications.filter((n) => !n.isRead).length}
    </span>
  )}
</div>
{showNotifications && (
  <div
    style={{
      position: "absolute",
      top: "60px",
      right: "100px",
      background: "#fff",
      width: "350px",
      maxHeight: "300px",
      overflowY: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      padding: "10px",
      zIndex: 999,
    }}
  >
    <h4>Notifications</h4>

    {notifications.length === 0 ? (
  <p>No notifications</p>
) : (
  notifications.map((n) => (
    <div
      key={n.id}
      style={{
        padding: "10px",
        marginBottom: "10px",
        background: n.isRead ? "#f4f4f4" : "#fff3cd",
        borderRadius: "8px",
      }}
    >
      <div
        style={{ cursor: "pointer" }}
        onClick={async () => {
          if (!n.isRead) {
            await API.put(`/notifications/${n.id}`);

            setNotifications((prev) =>
              prev.map((item) =>
                item.id === n.id
                  ? { ...item, isRead: 1 }
                  : item
              )
            );
          }
        }}
      >
        {n.message}
      </div>

      <button
        style={{
          marginTop: "8px",
          background: "#2ecc71",
          color: "#fff",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={async () => {
          if (window.confirm("Delete this notification?")) {
            await API.delete(`/notifications/${n.id}`);

            setNotifications((prev) =>
              prev.filter((item) => item.id !== n.id)
            );
          }
        }}
      >
        🗑️ Delete
      </button>
    </div>
  ))
)}
  </div>
)}
            <span
              style={{
                background: "#fdebd0",
                padding: "8px 15px",
                borderRadius: "20px",
              }}
            >
              OWNER
            </span>

            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "#2ecc71",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {localStorage.getItem("adminName")
                ? localStorage
                    .getItem("adminName")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "AD"}
            </div>

            <button
              onClick={logout}
              style={{
                border: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                background: "#2ecc71",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Body */}
        <div style={{ width: "80%", margin: "30px auto" }}>
          <Sidebar setPage={setPage} page={page} />

          {page === "overview" && <Overview adminId={adminId} />}
          {page === "dishes" && <Dishes adminId={adminId} />}
          {page === "tables" && <Tables adminId={adminId} />}
          {page === "reservations" && <Reservations adminId={adminId} />}
          {page === "ai" && <AIInsights adminId={adminId} />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;