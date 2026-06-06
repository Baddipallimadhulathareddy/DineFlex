import React, { useEffect, useState } from "react";
import API from "../api/api";
import coupleImg from "./images/bg-blurred-restaurant.png";

function Overview({ adminId }) {
  const [data, setData] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    API.get(`/admins/overview/${adminId}`)
      .then((res) => setData(res.data))
      .catch(console.log);
  }, [adminId]);

  if (!data || !data.admin) return <h2>Loading...</h2>;

  const admin = data.admin;

  const card = {
    flex: 1,
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  };

  const detailCard = {
    background: "#f8f9fa",
    padding: "18px",
    borderRadius: "14px",
    flex: "1",
    minWidth: "220px"
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: "#2ecc71",
          borderRadius: "22px",
          color: "#fff",
          padding: "40px",
          marginBottom: "30px"
        }}
      >
        <h1>Welcome back, {admin.name}! 👋</h1>
        <p>Manage your restaurant: {admin.restaurantName}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={card}>
          <h2>{data.dishes}</h2>
          <p>Menu Items</p>
        </div>

        <div style={card}>
          <h2>{data.tables}</h2>
          <p>Tables</p>
        </div>

        <div style={card}>
          <h2>{data.reservations}</h2>
          <p>Reservations</p>
        </div>
      </div>

      {/* Restaurant Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        <img
          src={
            !imgError && admin.image
              ? `https://dineflex-production.up.railway.app/uploads/${admin.image}`
              : coupleImg
          }
          alt="restaurant"
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover"
          }}
        />

        <div style={{ padding: "30px" }}>
          <h2>{admin.restaurantName}</h2>
          <p style={{ color: "#777" }}>📍 {admin.address}</p>
          <p style={{ color: "#777" }}>🍽 {admin.type}</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "25px"
            }}
          >
            <div style={detailCard}>
              <h4>Owner Name</h4>
              <p>{admin.name}</p>
            </div>

            <div style={detailCard}>
              <h4>Email</h4>
              <p>{admin.email}</p>
            </div>

            <div style={detailCard}>
              <h4>Phone</h4>
              <p>{admin.phone}</p>
            </div>
          </div>

          <div
            style={{
              background: "#fff8ef",
              padding: "18px",
              borderRadius: "15px",
              marginTop: "25px"
            }}
          >
            <h4>Description</h4>
            <p>{admin.description}</p>
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "inline-block",
              background: "#d5f5e3",
              padding: "12px 20px",
              borderRadius: "15px",
              color: "green",
              fontWeight: "bold"
            }}
          >
            ✅ Active Listed on DineFlex
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;