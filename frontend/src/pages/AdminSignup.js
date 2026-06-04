import React, { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

function AdminSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    restaurantName: "",
    type: "",
    description: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("image", image);

    try {
      await API.post("/admins/signup", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Admin Registered Successfully");
    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${require("./images/bg-blurred-restaurant.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(0px)"
      }}
    >
      {/* Main Card */}
      <div
        style={{
          display: "flex",
          width: "900px",
          borderRadius: "20px",
          overflow: "hidden",
          background: "white",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.2)"
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            width: "40%",
            background: "linear-gradient(135deg,#ff7a00,#ff9a2f)",
            color: "white",
            padding: "30px",
            textAlign: "center"
          }}
        >
          <img
            src={require("./images/restaurant-owner.png")}
            alt="owner"
            style={{
              width: "150px",
              borderRadius: "15px",
              marginBottom: "20px"
            }}
          />

          <h3>Partner with DineFlex 🤝</h3>

          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <p>📈 Grow your customer base</p>
            <p>📊 Real-time reservation tracking</p>
            <p>🍽 Manage tables & dishes</p>
            <p>💰 Zero commission fees</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ width: "60%", padding: "30px" }}>
          <h2 style={{ marginBottom: "10px" }}>Partner with Us 🏪</h2>

          <p style={{ color: "gray", marginBottom: "20px" }}>
            List your restaurant and grow your business
          </p>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px"
              }}
            >
              <input
                name="name"
                placeholder="Owner Name"
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Row 2 */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px"
              }}
            >
              <input
                name="phone"
                placeholder="Mobile Number"
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Restaurant Section */}
            <h4 style={{ marginTop: "15px" }}>🏪 Restaurant Details</h4>

            <input
              name="restaurantName"
              placeholder="Restaurant Name"
              onChange={handleChange}
              required
              style={inputStyleFull}
            />

            <input
              name="address"
              placeholder="Location / Address"
              onChange={handleChange}
              required
              style={inputStyleFull}
            />

            <input
              name="type"
              placeholder="Type (Veg/Non-Veg/etc)"
              onChange={handleChange}
              style={inputStyleFull}
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              style={{ ...inputStyleFull, height: "60px" }}
            />

            {/* Image Upload */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                background: "#ff7a00",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🚀 Register Restaurant
            </button>
          </form>

          {/* Login Link */}
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const inputStyleFull = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default AdminSignup;