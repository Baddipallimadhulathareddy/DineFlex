import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "./images/b.jpg";

function SuperDashboard() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const load = async () => {
    const a = await axios.get("https://dineflex-production.up.railway.app/api/super/admins");
    const u = await axios.get("https://dineflex-production.up.railway.app/api/super/users");

    setAdmins(a.data);
    setUsers(u.data);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (method, url) => {
    try {
      await axios({ method, url });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("super");
  navigate("/");
};
  const sidebarItems = [
    ["dashboard", "📊 Dashboard Overview"],
    ["admins", "👥 Manage Admins"],
    ["users", "🧑‍💻 Manage Users"],
    ["blocked", "🚫 Blocked Accounts"],
  ];

  const renderTable = (data, type) => (
    <div
      style={{
        background: "#fff",
        borderRadius: "25px",
        overflow: "hidden",
        color: "#111",
        boxShadow: "0 8px 25px rgba(0,0,0,.35)"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 2fr 1fr 2fr",
          padding: "22px",
          fontWeight: "700",
          color: "#60738e",
          background: "#f7f9fc"
        }}
      >
        <div>NAME</div>
        <div>EMAIL</div>
        <div>RESTAURANT</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      {data.map((item) => (
        <div
          key={item.id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 2fr 1fr 2fr",
            padding: "22px",
            alignItems: "center",
            borderBottom: "1px solid #eee"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "#00c97b",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "700"
              }}
            >
              {item.name?.slice(0, 2).toUpperCase()}
            </div>
            {item.name}
          </div>

          <div>{item.email}</div>
          <div>{item.restaurantName || "-"}</div>

          <div>
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "30px",
                background: item.blocked ? "#ffe2e7" : "#d9ffe8",
                color: item.blocked ? "#ff3160" : "#00a85a",
                fontWeight: "700"
              }}
            >
              {item.blocked ? "🔴 Blocked" : "🟢 Active"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {item.blocked ? (
              <button
                onClick={() =>
                  action(
                    "put",
                    `https://dineflex-production.up.railway.app/api/super/unblock-${type}/${item.id}`
                  )
                }
                style={greenBtn}
              >
                🛡️ Unblock
              </button>
            ) : (
              <button
                onClick={() =>
                  action(
                    "put",
                    `https://dineflex-production.up.railway.app/api/super/block-${type}/${item.id}`
                  )
                }
                style={yellowBtn}
              >
                🚫 Block
              </button>
            )}

            <button
              onClick={() =>
                action(
                  "delete",
                  `https://dineflex-production.up.railway.app/api/super/delete-${type}/${item.id}`
                )
              }
              style={redBtn}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        fontFamily: "Arial"
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h1>🍽 DINEFLEX</h1>
          <div>
            <div style={{ fontWeight: "700" }}>Super User Dashboard</div>
            <small style={{ color: "#bbb" }}>Platform command center</small>
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: "30px",
              border: "1px solid #00d084",
              color: "#00d084"
            }}
          >
            ✨ PLATFORM CONTROL
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <b>Super Admin</b>
            <div style={{ fontSize: "12px", color: "#bbb" }}>
              madhureddy@gmail.com
            </div>
          </div>

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#00c97b",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "700"
            }}
          >
            MR
          </div>

          <button
  onClick={logout}
  style={{
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#f2f2f2",
    fontWeight: "600"
  }}
>
  ↪ Logout
</button>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "280px",
            padding: "30px",
            backdropFilter: "blur(18px)"
          }}
        >
          {sidebarItems.map(([key, label]) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "18px",
                borderRadius: "18px",
                marginBottom: "16px",
                cursor: "pointer",
                background:
                  activeTab === key ? "#00c97b" : "rgba(255,255,255,.05)",
                fontWeight: "700"
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "40px" }}>
          <h1 style={{ fontSize: "50px" }}>
            {activeTab === "dashboard"
              ? "Welcome back, Super Admin"
              : activeTab === "admins"
              ? "👥 Manage Admins"
              : activeTab === "users"
              ? "🧑‍💻 Manage Users"
              : "🚫 Blocked Accounts"}
          </h1>

          <p style={{ color: "#bbb" }}>
            Here's what's happening across DINEFLEX today.
          </p>

          {(activeTab === "admins" || activeTab === "users") && (
            <input
              placeholder="🔍 Search by name or email..."
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "35px",
                border: "none",
                margin: "20px 0",
                fontSize: "16px"
              }}
            />
          )}

          {activeTab === "dashboard" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px",
                marginTop: "30px"
              }}
            >
              {[
                ["👥 Total Admins", admins.length],
                ["🧑‍💻 Total Users", users.length],
                [
                  "🚫 Blocked Accounts",
                  admins.filter((a) => a.blocked).length +
                    users.filter((u) => u.blocked).length
                ],
                ["🏪 Active Restaurants", admins.length]
              ].map(([title, value]) => (
                <div
                  key={title}
                  style={{
                    background: "#fff",
                    color: "#111",
                    padding: "35px",
                    borderRadius: "25px"
                  }}
                >
                  <h3>{title}</h3>
                  <h1 style={{ fontSize: "52px" }}>{value}</h1>
                </div>
              ))}
            </div>
          )}

          {activeTab === "admins" && renderTable(admins, "admin")}
          {activeTab === "users" && renderTable(users, "user")}
          {activeTab === "blocked" &&
            renderTable(
              [...admins.filter((a) => a.blocked), ...users.filter((u) => u.blocked)],
              "admin"
            )}
        </div>
      </div>
    </div>
  );
}

const yellowBtn = {
  background: "#fff3cd",
  color: "#ff9800",
  border: "none",
  padding: "10px 16px",
  borderRadius: "14px",
  cursor: "pointer"
};

const greenBtn = {
  background: "#d9ffe8",
  color: "#00a85a",
  border: "none",
  padding: "10px 16px",
  borderRadius: "14px",
  cursor: "pointer"
};

const redBtn = {
  background: "#ffe2e7",
  color: "#ff3160",
  border: "none",
  padding: "10px 16px",
  borderRadius: "14px",
  cursor: "pointer"
};



export default SuperDashboard;

