import React, { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

// 👉 import images
import bgImage from "./images/bg-blurred-restaurant.png";
import foodImage from "./images/bg-blurred-restaurant.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async () => {
  try {
    if (role === "user") {
      const res = await API.post("/users/login", {
        email,
        password
      });

    localStorage.setItem("userId", res.data.user.id);
localStorage.setItem("userName", res.data.user.name);
localStorage.setItem("userEmail", res.data.user.email);
localStorage.setItem("userPhone", res.data.user.phone);
localStorage.setItem("userAddress", res.data.user.address);

alert("User Login Successful");
window.location.href = "/user-dashboard";

    } else {

      const res = await API.post("/admins/login", {
        email,
        password
      });

      localStorage.setItem("adminId", res.data.admin.id);
      localStorage.setItem("adminName", res.data.admin.name);

      alert("Admin Login Successful");
      window.location.href = "/admin-dashboard";
    }

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
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* BLUR OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      ></div>

      {/* MAIN CARD */}
      <div
        style={{
          width: "950px",
          height: "540px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          zIndex: 1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#2ecc71",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <img
            src={foodImage}
            alt="food"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              marginBottom: "20px",
              border: "5px solid rgba(255,255,255,0.4)",
              objectFit: "cover",
            }}
          />

          <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
            Taste the Experience
          </h2>

          <p style={{ marginTop: "10px", opacity: 0.9 }}>
            Book tables at your favorite restaurants with ease.
            Discover new dining experiences every day.
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <span style={tagStyle}>🍕 Pizza</span>
            <span style={tagStyle}>🍣 Sushi</span>
            <span style={tagStyle}>🥩 Steak</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#ecf0f1",
            padding: "45px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Welcome Back! 👋</h2>
          <p style={{ color: "gray", marginBottom: "25px" }}>
            Welcome back, food lover!
          </p>

          {/* ✅ FIXED TOGGLE */}
          <div
            style={{
              display: "flex",
              background: "#dcdde1",
              borderRadius: "30px",
              padding: "5px",
              marginBottom: "25px",
            }}
          >
            <button
              onClick={() => setRole("user")}
              style={{
                flex: 1,
                padding: "14px 0",
                border: "none",
                borderRadius: "25px",
                background: role === "user" ? "#ffffff" : "transparent",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              User
            </button>

            <button
              onClick={() => setRole("admin")}
              style={{
                flex: 1,
                padding: "14px 0",
                border: "none",
                borderRadius: "25px",
                background: role === "admin" ? "#ffffff" : "transparent",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              Admin
            </button>
          </div>

          {/* INPUTS */}
          <input
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            style={{
              marginTop: "15px",
              padding: "14px",
              background: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🚀 Login
          </button>
            <p style={{marginTop:"20px"}}>
Are you Super User?

<a href="/super-login" style={{ color: "#27ae60" }}>
 Login here
</a>
</p>
          {/* LINKS */}
          <p style={{ marginTop: "18px" }}>
            New here?{" "}
            <Link to="/user-signup" style={{ color: "#27ae60" }}>
              Join as a Customer
            </Link>
          </p>

          <p>
            Own a restaurant?{" "}
            <Link to="/admin-signup" style={{ color: "#27ae60" }}>
              Register your Restaurant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// styles
const inputStyle = {
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px",
};

const tagStyle = {
  background: "rgba(255,255,255,0.2)",
  padding: "6px 12px",
  borderRadius: "20px",
};

export default Login;