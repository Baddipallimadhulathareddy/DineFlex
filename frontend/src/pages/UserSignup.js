import React, { useState } from "react";
import API from "../api/api";
import bgImage from "./images/bg-blurred-restaurant.png";
import coupleImg from "./images/couple-dining-illustration.png";
import { Link } from "react-router-dom";
function UserSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/signup", form);
      alert("User Registered Successfully");
    } catch (err) {
      console.log(err);
      alert("Signup Failed");
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
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Blur Overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      ></div>

      {/* Main Card */}
      <div
        style={{
          width: "900px",
          height: "520px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          zIndex: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #2ecc71, #27ae60)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "30px",
          }}
        >
          <img
            src={coupleImg}
            alt="dining"
            style={{
              width: "180px",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />

          <h2>Your Table Awaits 🍷</h2>

          <div style={{ marginTop: "20px", width: "100%" }}>
            <p>🔍 Discover top-rated restaurants</p>
            <p>📅 Book tables in seconds</p>
            <p>⭐ Save your favorites</p>
            <p>🎉 Exclusive dining experiences</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            background: "#f5f5f5",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>
            Create Account 🎉
          </h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            Start booking tables today
          </p>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="phone"
              placeholder="Mobile Number"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              ✨ Create Account
            </button>
          </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
                  Already have an account? <Link to="/">Login</Link>
                </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
};

export default UserSignup;