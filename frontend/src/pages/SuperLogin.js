import React, { useState } from "react";
import axios from "axios";

import bgImage from "./images/b.jpg";
import circleImage from "./images/circle.jpg";

function SuperLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post(
        "https://dineflex-production.up.railway.app/api/super/login",
        { email, password }
      );

      localStorage.setItem("super", "true");
      window.location = "/super-dashboard";

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        display: "flex", // FIXED
        justifyContent: "center",
        alignItems: "center",
        gap: "60px",

        padding: "20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.45)"
        }}
      />

      {/* LEFT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "420px",
          color: "#fff"
        }}
      >
        <img
          src={circleImage}
          alt="food"
          style={{
            width: "170px",
            height: "170px",
            borderRadius: "50%",
            border: "4px solid #00c37a",
            objectFit: "cover",
            boxShadow: "0 0 25px rgba(0,195,122,0.4)"
          }}
        />

        <div
          style={{
            marginTop: "22px",
            display: "inline-block",
            padding: "8px 18px",
            borderRadius: "25px",
            border: "1px solid rgba(0,255,170,0.35)",
            background: "rgba(255,255,255,0.05)",
            color: "#aef7d8",
            fontWeight: "600",
            fontSize: "13px"
          }}
        >
          ✦ DINEFLEX PLATFORM
        </div>

        <h1
          style={{
            fontSize: "42px",
            marginTop: "22px",
            lineHeight: "1.15",
            fontWeight: "800"
          }}
        >
          DINEFLEX{" "}
          <span style={{ color: "#00c37a" }}>
            Super Control
          </span>
        </h1>

        <p
          style={{
            marginTop: "18px",
            fontSize: "15px",
            color: "#d8d8d8",
            lineHeight: "1.6"
          }}
        >
          Secure access for platform management.
          Govern restaurants, admins and analytics
          from one elegant command center.
        </p>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "350px",
          padding: "28px",
          borderRadius: "24px",
          background: "rgba(10,20,20,0.78)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55)"
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "24px",
            marginBottom: "8px"
          }}
        >
          Super User Login
        </h2>

        <p
          style={{
            color: "#9aa5a2",
            marginBottom: "30px",
            fontSize: "14px"
          }}
        >
          Restricted access only
        </p>

        <label style={labelStyle}>EMAIL</label>
        <input
          style={inputStyle}
          placeholder="admin@dineflex.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={labelStyle}>PASSWORD</label>
        <input
          type="password"
          style={inputStyle}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            marginTop: "18px",
            padding: "13px",
            borderRadius: "14px",
            border: "none",
            background: "#00c37a",
            color: "#fff",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,195,122,0.35)"
          }}
        >
          → Secure Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px"
          }}
        >
          <a
            href="/"
            style={{
              color: "#b7b7b7",
              textDecoration: "none",
              fontSize: "14px"
            }}
          >
            ← Back to Main Login
          </a>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#667",
            fontSize: "11px",
            letterSpacing: "1px"
          }}
        >
          PROTECTED BY DINEFLEX SENTINEL · 256-BIT
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontSize: "13px",
  outline: "none"
};

const labelStyle = {
  color: "#a4a4a4",
  fontSize: "12px",
  fontWeight: "600",
  display: "block",
  marginBottom: "8px"
};

export default SuperLogin;